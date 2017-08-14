import * as React from 'react';
import * as GradeLevels  from "./GradeLevels";

interface InteractionType {
    code: string;
    label: string;
}

interface Claim {
    code: string;
    label: string;
}

interface Subject {
    code: string;
    label: string;
    claims: Claim[];
    interactionTypeCodes: string[];
}

interface SearchAPIParams {
    itemId: string;
    gradeLevels: GradeLevels.GradeLevels;
    subjects: string[];
    claims: string[];
    interactionTypes: string[];
    performanceOnly: boolean;
}

export interface Props {
    interactionTypes: InteractionType[];
    subjects: Subject[];
    onChange: (params: SearchAPIParams) => void;
    selectSingleResult: () => void;
    isLoading: boolean;
}

export interface State {
    itemId: string;
    gradeLevels: GradeLevels.GradeLevels;
    subjects: string[];
    claims: string[];
    interactionTypes: string[];
    performanceOnly: boolean;
}

function parseQueryString(url: string): { [key: string]: string[] | undefined } {
    let queryObject: { [key: string]: string[] | undefined } = {};
    const pairs = url.slice(url.indexOf("?") + 1).split("&");
    for (const pair of pairs) {
        const pairParts = pair.split("=");
        if (pairParts[0] && pairParts[1]) {
            queryObject[pairParts[0]] = pairParts[1].split(",");
        }
    }
    return queryObject;
}

export class ItemSearchDropdown extends React.Component<Props, State>{
    timeoutToken?: number;

    constructor(props: Props) {
        super(props);

        const queryObject = parseQueryString(location.search);
        const itemId = (queryObject["itemID"] || [])[0] || "";

        const gradeString = (queryObject["gradeLevels"] || [])[0];
        const gradeLevels: GradeLevels.GradeLevels = parseInt(gradeString, 10) || GradeLevels.GradeLevels.NA;

        const subjects = queryObject["subjects"] || [];
        const claims = queryObject["claims"] || [];
        const interactionTypes = queryObject["interactionTypes"] || [];
        const performanceOnly = (queryObject["performanceOnly"] || [])[0] === "true";

        this.state = {
            itemId: itemId,
            gradeLevels: gradeLevels,
            subjects: subjects,
            claims: claims,
            interactionTypes: interactionTypes,
            performanceOnly: performanceOnly
        };

        this.onChange();
    }

    onChange() {
        const params: SearchAPIParams = {
            itemId: this.state.itemId || "",
            gradeLevels: this.state.gradeLevels || GradeLevels.GradeLevels.All,
            subjects: this.state.subjects || [],
            claims: this.state.claims || [],
            interactionTypes: this.state.interactionTypes || [],
            performanceOnly: this.state.performanceOnly || false
        };
        this.props.onChange(params);
    }

    encodeQuery(): string {
        let pairs: string[] = [];
        if (this.state.claims && this.state.claims.length !== 0) {
            pairs.push("claims=" + this.state.claims.join(","));
        }
        if (this.state.gradeLevels !== GradeLevels.GradeLevels.NA) {
            pairs.push("gradeLevels=" + this.state.gradeLevels);
        }
        if (this.state.interactionTypes && this.state.interactionTypes.length !== 0) {
            pairs.push("interactionTypes=" + this.state.interactionTypes.join(","));
        }
        if (this.state.itemId) {
            pairs.push("itemID=" + this.state.itemId);
        }
        if (this.state.subjects && this.state.subjects.length !== 0) {
            pairs.push("subjects=" + this.state.subjects.join(","));
        }
        if (this.state.performanceOnly) {
            pairs.push("performanceOnly=true");
        }

        if (pairs.length === 0) {
            return "/BrowseItems";
        }

        const query = "?" + pairs.join("&");
        return query;
    }
}