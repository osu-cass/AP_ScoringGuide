import {
    FilterOptionModel,
    GradeLevels,
    GradeLevel,
    AdvancedFilterCategoryModel,
    ItemCardModel
} from '@osu-cass/sb-components';


export class FilterHelper {

    //TODO: Get this from the server
    static getFilterOptions() {
        const subjectsFilterOptions: FilterOptionModel[] = [{
            label: "Mathematics",
            key: "MATH",
            isSelected: false
        },
        {
            label: "English",
            key: "ELA",
            isSelected: false
        }];

        const gradesFilterOptions: FilterOptionModel[] = [{
            label: GradeLevel.gradeCaseToString(GradeLevels.Grade3),
            key: String(GradeLevels.Grade3),
            isSelected: false
        }, {
            label: GradeLevel.gradeCaseToString(GradeLevels.Grade4),
            key: String(GradeLevels.Grade4),
            isSelected: false
        }, {
            label: GradeLevel.gradeCaseToString(GradeLevels.Grade5),
            key: String(GradeLevels.Grade5),
            isSelected: false
        }, {
            label: GradeLevel.gradeCaseToString(GradeLevels.Grade6),
            key: String(GradeLevels.Grade6),
            isSelected: false
        }, {
            label: GradeLevel.gradeCaseToString(GradeLevels.Grade7),
            key: String(GradeLevels.Grade7),
            isSelected: false
        }, {
            label: GradeLevel.gradeCaseToString(GradeLevels.Grade8),
            key: String(GradeLevels.Grade8),
            isSelected: false
        }, {
            label: GradeLevel.gradeCaseToString(GradeLevels.High),
            key: String(GradeLevels.High),
            isSelected: false
        }];

        const techTypesFilterOptions: FilterOptionModel[] = [{
            label: "CAT",
            key: "CAT",
            isSelected: false
        }, {
            label: "Performance Items",
            key: "PT",
            isSelected: false
        }];

        const subjects: AdvancedFilterCategoryModel = {
            disabled: false,
            isMultiSelect: false,
            label: "Subject",
            helpText: "Subjects HelpText here.",
            filterOptions: [...subjectsFilterOptions],
            displayAllButton: true,
            code: "Subject"
        }

        const grades: AdvancedFilterCategoryModel = {
            disabled: false,
            isMultiSelect: false,
            label: "Grade",
            helpText: "Grade HelpText here.",
            filterOptions: [...gradesFilterOptions],
            displayAllButton: true,
            code: "Grade"
        }

        const techTypes: AdvancedFilterCategoryModel = {
            disabled: false,
            isMultiSelect: false,
            label: "Tech Type",
            helpText: "TechType HelpText here.",
            filterOptions: [...techTypesFilterOptions],
            displayAllButton: false,
            code: "TechType"
        }

        return [subjects, grades, techTypes];
    }


}