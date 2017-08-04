import { ItemCardViewModel } from "./ItemCard";
import * as $ from 'jquery'

export interface ScoreSearchParams {
    itemKey: number;
    bankKey: number;
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

export const ScoreSearchClient = (params: ScoreSearchParams) => get<ItemCardViewModel>("/Controller/ScoringGuideController", params) 
