import * as ItemCard from "./ItemCard";
import * as $ from 'jquery';
import * as GradeLevels from './GradeLevels';

export interface ScoreSearchParams {
    gradeLevels: GradeLevels.GradeLevels;
    subjects: string[];
    techType: string[];
}

async function get<T>(url: string, params: object) {
    return new Promise<T>((resolve, reject) => {
        $.ajax({
            url: url,
            dataType: "json",
            traditional: true,
            data: params,
            success: resolve,
            error: (xhr, status, err) => reject(new Error(err)),
            type: "GET"
        })
    });
}

export const ScoreSearchClient = (params: ScoreSearchParams) => get<ItemCard.ItemCardViewModel[]>("/ScoringGuide/Search", params) 
