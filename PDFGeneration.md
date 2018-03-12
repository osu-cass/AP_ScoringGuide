# ScoreGuide PDF Generation
This document steps through the process of generating a PDF for a given set of items. The high level overview of the process is:
1. User makes a request for a PDF
2. Item data is loaded from API if it hasn't been already
3. Filter items based on search params
4. Loading view data for each item
5. Taking screenshots if needed

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
items: ItemModel[]; // items that are to be printed, goes in request body
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
We load the item metadata from the Sample Items Website API and cache it on the server in memory for quick access. This is done in the API Repo. We cache the following data:
- All the data in the `AboutItemModel` for each item. This includes the
    - `ItemCardModel`
    - Scoring information
    - Other items associated with performance items
    - A few other pieces of data we display with each item in the PDF
- List of subjects
- Filter search model (not used in PDF generation process; only for client to have parameters to filter by)

## Filtering items
If the user made the request for the PDF using the `GET` request above, we filter down the items using the `SearchAPIParamsModel`. This is done by calling the same method as is used on the client side:
```ts
ItemSearch.filterItemCards(itemCards: ItemCardModel[], filter: SearchAPIParamsModel): ItemCardModel[];
``` 

If the user made the request using the `POST` request above, we don't do any filtering. Instead, we only use the item IDs that are requested. 

## Loading view data
We go through for each item and make a request to get the item from Item Viewer Service API so we can inspect it to see if there are any interactive elements. We process the returned HTML by doing the following:
1. Remove any links
2. Remove the question number that is shown on the screen (we add our own on the PDF)
3. Replace image source links with the absolute URL equivalent
4. Fix multiple choice problems so that each option has the corresponding letter on the same line and is bolded
5. Check if there is a passage. We do this by checking for any elements of class `thePassage`. If so, add it to the `ItemGroupModel` for that item. Otherwise, leave the `ItemGroupModel.passage` undefined. If there is a passage, check it to make sure there are no interactive elements (see below for more).
6. For each item in the group (there is only more than 1 for performance items), find an element with id `Item_<ItemKey>`. We add this to the `ItemGroupModel`.

### Checking for interactive elements
We noticed that if there are interactive elements within an item (either in the passage or one of the questions), there will be a `<span>` element with the text `Initializing`. We use this assumption to figure out whether using the HTML as the view for a question or passage will be an accurate representation of how it would look on a test. If we find `<span>Initializing</span>`, there is some sort of user interaction using JavaScript that hasn't loaded yet in every case we have seen. 

If there are no interactive parts for the question, we can just use the processed HTML as the view. If there are, however, we need to take a screenshot of the item instead. This process is documented below. We use Cheerio (a server-side version of jQuery with a ridiculous name) to parse the items' HTML.

## Taking screenshots
If either the passage or any of the questions in an `ItemGroupModel` is tagged that we need to use screenshots, we need to render that part and take a screenshot. To make it as close to what it would look like as possible, we just load the item using Chrome and take the picture. We use [Puppeteer](https://developers.google.com/web/tools/puppeteer/) to control a headless version of Chrome from its Node.js API. 

We use Puppeteer to configure the page before taking the screenshot by doing the following:
1. Open a new tab and load the item on Item Viewer Service
2. Set the page to the page width specified in the .ENV config file (or environment variables)
3. Wait until we see an element with the `grouping` class within the `IFrame`, then wait a little longer for the item to load (200ms)
4. Calculate the height of the element we're screenshotting + height of the header, then set the page's height to make sure the whole item is in the picture. 
5. Get the position, height, and width of the element(s) we're going to take a screenshot of. We assume the passage will be marked by class `thePassage` and the questions will be in a container element with class `theQuestions`.
6. Take the screenshot(s)
7. Close the page