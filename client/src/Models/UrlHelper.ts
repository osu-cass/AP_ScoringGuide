import { AdvancedFilterOption, AdvancedFilterCategory } from "@osu-cass/react-advanced-filter";
import { parseQueryString } from "../Models/ApiModels";

export function updateUrl(filters: AdvancedFilterCategory[]) {
    let pairs: string[] = [];

    filters.forEach(f => {
        if (!f.disabled) {
            const key = f.label.toLowerCase().replace(/ /g, "-");
            const value = f.filterOptions.filter(o => o.isSelected).map(o => o.key).join(",");
            if (value !== "") {
                pairs.push(key + "=" + value);
            }
        }
    });

    let query: string;
    if (pairs.length === 0) {
        query = "";
    } else {
        query = "?" + pairs.join("&");
    }
    
    const urlPath = (typeof(window) !== 'undefined') ? window.location.pathname : "/";
    history.replaceState(null, "", urlPath + query);
}

export function readUrl(filters: AdvancedFilterCategory[]) {
    const url = (typeof(window) !== 'undefined') ? window.location.href : "/";
    const queryObject = parseQueryString(url);
    for (let a in queryObject) {
        queryObject[a.replace(/-/g, " ")] = queryObject[a];
    }

    const newFilters = filters.map(f => {
        if (!f.disabled) {
            let selectedKeys = queryObject[f.label.toLowerCase()] || [];

            if (f.isMultiSelect) {
                selectedKeys = selectedKeys[0] ? [selectedKeys[0]] : [];
            }

            const newFilterOptions = f.filterOptions.map(o => {
                return {
                    ...o,
                    isSelected: (selectedKeys.indexOf(o.key) !== -1)
                }
            });

            return {
                ...f,
                filterOptions: newFilterOptions
            };
        } else {
            return f;
        }
    });
    return newFilters;
}