import { get, ItemsSearchModel, ItemCardModel, ItemModel, AboutItemModel, AdvancedFilterCategoryModel, FilterType, GradeLevels, GradeLevel, FilterOptionModel } from "@osu-cass/sb-components";

export const itemSearchModelClient = () =>
    get<ItemsSearchModel>("http://is-score.cass.oregonstate.edu/ScoringGuide/ScoringGuideViewModel");

export const itemCardClient = () =>
    get<ItemCardModel[]>("api/search");

export const aboutItemClient = (params: ItemModel) =>
    get<AboutItemModel>("/api/aboutItem", params)

export function unwrapArray<T>(array?: T[]) {
    return array ? array : [];
}

export function getFilterFromScoringGuideVM(viewModel: ItemsSearchModel): AdvancedFilterCategoryModel[] {
    const subjectOptions = unwrapArray(viewModel.subjects)
        .map(s => {
            return {
                label: s.label,
                key: s.code,
                isSelected: false,
                filterType: FilterType.Subject
            } as FilterOptionModel;
        });

    const grades = [
        GradeLevels.Grade3, 
        GradeLevels.Grade4, 
        GradeLevels.Grade5, 
        GradeLevels.Grade6,
        GradeLevels.Grade7,
        GradeLevels.Grade8,
        GradeLevels.High    
    ];

    const gradeOptions = grades.map(g => {
        return {
            label: GradeLevel.gradeCaseToString(g),
            key: g.toString(),
            isSelected: false,
            filterType: FilterType.Claim
        } as FilterOptionModel;
    });

    const techTypeOptions: FilterOptionModel[] = [
        {
            label: "Performance",
            key: "PT",
            isSelected: false,
            filterType: FilterType.Performance
        },
        {
            label: "CAT",
            key: "CAT",
            isSelected: false,
            filterType: FilterType.CAT
        }
    ]
    
    return [
        {
            disabled: false,
            label: "Grade",
            filterOptions: gradeOptions,
            code: FilterType.Grade,
            isMultiSelect: false,
            displayAllButton: false
        },
        {
            disabled: false,
            label: "Subject",
            filterOptions: subjectOptions,
            code: FilterType.Subject,
            isMultiSelect: false,
            displayAllButton: false
        },
        {
            disabled: false,
            label: "Tech-Type",
            filterOptions: techTypeOptions,
            code: FilterType.PerformanceCAT,
            isMultiSelect: false,
            displayAllButton: false
        }
    ]
}
