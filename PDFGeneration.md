# ScoreGuide PDF Generation
This document steps through the process of generating a PDF for a given set of items. The high level overview of the process is:
1. User makes a request for a PDF
2. Item data is loaded from API if it hasn't been already
3. 

## Request
There are two ways to request a PDF from this API:
### 1. GET `/api/pdf`
Has the same parameters as `SearchAPIParamsModel`, along with a few for customizing the PDF. All of these are URL parameters. Note that optional parameters have a `?` and arrays are denoted by `[]`. 
```ts
// params from SearchAPIParamsModel
itemId?: string;
gradeLevels: GradeLevels;
subjects: string[];
claims?: string[];
interactionTypes?: string[];
performanceOnly?: boolean; // either this or catOnly is required
catOnly?: boolean; // either this or performanceOnly is required
targets?: number[];
calculator?: boolean;
// other params
titlePage?: boolean; // display title page, defaults to true
scoringInfo?: boolean; // display scoring info, defaults to true
```
### 2. POST `/api/pdf/items`
This call is for specifying a specific list of items that should be shown in the PDF, rather than displaying all items matching search terms. Parameters go in URL (except for items array) and are as follows:
```ts
items: ItemModel; // items that are to be printed, goes in request body
assoc?: boolean; // print items associated with other items in list, defaults to false
scoringInfo?: boolean; // display the scoring info, defaults to true
```
Where `ItemModel` is of the form:
```ts
interface ItemModel {
    itemKey: number;
    bankKey: number;
}
```

## Loading Item Data from API
