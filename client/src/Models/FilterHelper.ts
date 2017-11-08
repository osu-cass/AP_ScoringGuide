import { ItemCardViewModel } from "../Models/ItemCardViewModel";
import { ItemFilter, FilterOptions } from "../Models/ItemModels";
import * as GradeLevels from '../Models/GradeLevels';
import { parseQueryString } from "../Models/ApiModels";
import { OptionType, AdvancedFilters, AdvancedFilterOption, AdvancedFilterCategory } from "@osu-cass/react-advanced-filter";

export class FilterHelper {

    //TODO: Get this from the server
    static getFilterOptions() {
        const subjectsFilterOptions: AdvancedFilterOption[] = [{
            label: "Mathematics",
            key: "MATH",
            isSelected: false
        },
        {
            label: "English",
            key: "ELA",
            isSelected: false
        }];

        const gradesFilterOptions: AdvancedFilterOption[] = [{
            label: GradeLevels.caseToString(GradeLevels.GradeLevels.Grade3),
            key: String(GradeLevels.GradeLevels.Grade3),
            isSelected: false
        }, {
            label: GradeLevels.caseToString(GradeLevels.GradeLevels.Grade4),
            key: String(GradeLevels.GradeLevels.Grade4),
            isSelected: false
        }, {
            label: GradeLevels.caseToString(GradeLevels.GradeLevels.Grade5),
            key: String(GradeLevels.GradeLevels.Grade5),
            isSelected: false
        }, {
            label: GradeLevels.caseToString(GradeLevels.GradeLevels.Grade6),
            key: String(GradeLevels.GradeLevels.Grade6),
            isSelected: false
        }, {
            label: GradeLevels.caseToString(GradeLevels.GradeLevels.Grade7),
            key: String(GradeLevels.GradeLevels.Grade7),
            isSelected: false
        }, {
            label: GradeLevels.caseToString(GradeLevels.GradeLevels.Grade8),
            key: String(GradeLevels.GradeLevels.Grade8),
            isSelected: false
        }, {
            label: GradeLevels.caseToString(GradeLevels.GradeLevels.High),
            key: String(GradeLevels.GradeLevels.High),
            isSelected: false
        }];

        const techTypesFilterOptions: AdvancedFilterOption[] = [{
            label: "CAT",
            key: "CAT",
            isSelected: false
        }, {
            label: "Performance Items",
            key: "PT",
            isSelected: false
        }];

        const subjects: AdvancedFilterCategory = {
            disabled: false,
            isMultiSelect: false,
            label: "Subject",
            helpText: "Subjects HelpText here.",
            filterOptions: [...subjectsFilterOptions],
            displayAllButton: true
        }

        const grades: AdvancedFilterCategory = {
            disabled: false,
            isMultiSelect: false,
            label: "Grade",
            helpText: "Grade HelpText here.",
            filterOptions: [...gradesFilterOptions],
            displayAllButton: true
        }

        const techTypes: AdvancedFilterCategory = {
            disabled: false,
            isMultiSelect: false,
            label: "TechType",
            helpText: "TechType HelpText here.",
            filterOptions: [...techTypesFilterOptions],
            displayAllButton: false
        }
        
        return [subjects, grades, techTypes];
    }

    static filter(itemCards: ItemCardViewModel[], filter: AdvancedFilterCategory[]) {
        const grades = filter.find(afc => afc.label === "Grade");
        const subjects = filter.find(afc => afc.label === "Subjects");
        const techTypes = filter.find(afc => afc.label === "TechType");

        if (grades && grades.filterOptions) {
            let selectedGrades = GradeLevels.GradeLevels.NA;

            grades.filterOptions.forEach(gradeFilter => {
                if (gradeFilter.isSelected) {
                    selectedGrades = selectedGrades | Number(gradeFilter.key);
                }
            });

            if (selectedGrades === GradeLevels.GradeLevels.NA) {
                selectedGrades = GradeLevels.GradeLevels.All;
            }

            itemCards = itemCards.filter(g => GradeLevels.contains(selectedGrades, g.grade));
        }

        if (subjects && subjects.filterOptions) {
            let subjectCode:string|undefined;

            subjects.filterOptions.forEach(s => {
                if(s.isSelected){
                    subjectCode = s.key;
                }
            });
            if(subjectCode !== undefined){
                itemCards = itemCards.filter(i => subjectCode === i.subjectCode);
            }
        }
        //TODO: What is CAT technology? Filter? Ignore?
        if (techTypes && techTypes.filterOptions) {
            if (techTypes.filterOptions.find(t => t.key === "PT" && t.isSelected)) {
                itemCards = itemCards.filter(i => i.isPerformanceItem);
            } else if (techTypes.filterOptions.find(t => t.key === "CAT" && t.isSelected)) {
                itemCards = itemCards.filter(i => !i.isPerformanceItem);
            }
        }

        return itemCards;
    }
}