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

    beginChangeTimeout() {
        if (this.timeoutToken !== undefined) {
            clearTimeout(this.timeoutToken);
        }

        this.timeoutToken = setTimeout(() => this.onChange(), 200);
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

    onItemIDInput(e: React.FormEvent<HTMLInputElement>) {
        const newValue = e.currentTarget.value;
        const isInputOK = /^\d{0,4}$/.test(newValue);
        if (isInputOK) {
            this.setState({
                itemId: newValue
            }, () => this.beginChangeTimeout());
        }
    }

    onItemIDKeyUp(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.keyCode === 13) {
            this.props.selectSingleResult();
        }
    }

    togglePerformanceOnly() {
        this.setState({
            performanceOnly: !this.state.performanceOnly
        }, () => this.beginChangeTimeout());
    }

    toggleSubject(subject: string) {
        const subjectCodes = this.state.subjects || [];
        const containsSubject = subjectCodes.indexOf(subject) !== -1;
        const newSubjectCodes = containsSubject ? subjectCodes.filter(s => s !== subject) : subjectCodes.concat([subject]);

        if (newSubjectCodes.length === 0) {
            this.setState({
                subjects: newSubjectCodes,
                claims: [],
                interactionTypes: []
            }, () => this.beginChangeTimeout());
            return;
        }

        const newSubjects = this.props.subjects.filter(s => newSubjectCodes.indexOf(s.code) !== -1);

        // Remove all claims not contained by the newly selected subjects
        const subjectClaimCodes = newSubjects.reduce((prev: string[], cur: Subject) => prev.concat(cur.claims.map(c => c.code)), []);
        const newClaimCodes = this.state.claims.filter(c => subjectClaimCodes.indexOf(c) !== -1);

        const subjectInteractionCodes = newSubjects.reduce((prev: string[], cur: Subject) => prev.concat(cur.interactionTypeCodes), []);
        const newInteractionCodes = this.state.interactionTypes.filter(i => subjectInteractionCodes.indexOf(i) !== -1);

        this.setState({
            subjects: newSubjectCodes,
            claims: newClaimCodes,
            interactionTypes: newInteractionCodes
        }, () => this.beginChangeTimeout());
    }

    toggleClaim(claim: string) {
        const claims = this.state.claims;
        const containsClaim = claims.indexOf(claim) !== -1;
        this.setState({
            claims: containsClaim ? claims.filter(c => c !== claim) : claims.concat([claim])
        }, () => this.beginChangeTimeout());
    }

    toggleInteractionType(code: string) {
        const interactionTypes = this.state.interactionTypes;
        const containsSubject = interactionTypes.indexOf(code) !== -1;
        this.setState({
            interactionTypes: containsSubject ? interactionTypes.filter(s => s !== code) : interactionTypes.concat([code])
        }, () => this.beginChangeTimeout());
    }

    resetFilters() {
        this.setState({
            itemId: "",
            gradeLevels: GradeLevels.GradeLevels.NA,
            subjects: [],
            claims: [],
            interactionTypes: []
        }, () => this.beginChangeTimeout());
    }

    keyPressResetFilters(e: React.KeyboardEvent<HTMLElement>) {
        if (e.keyCode === 0 || e.keyCode === 13 || e.keyCode === 32) {
            this.resetFilters();
        }
    }

    render() {
        history.replaceState(null, "", this.encodeQuery());

        return (
            <div className="search-params">
                <div className="search-header">
                    <h1 className="search-title" tabIndex={0}>Browse Items</h1>
                    <div className="search-status">
                        {this.props.isLoading ? <img src="images/spin.gif" className="spin" /> : undefined}
                        <div><a onClick={() => this.resetFilters()} onKeyPress={e => this.keyPressResetFilters(e)} tabIndex={0}>Reset filters</a></div>
                    </div>
                </div>
                <div className="search-categories" aria-live="polite" aria-relevant="additions removals">
                    {this.renderGrades()}
                </div>
            </div>
        );
    }

    toggleGrades(grades: GradeLevels.GradeLevels) {
        this.setState({
            // Exclusive OR to flip just the bits for the input grades
            gradeLevels: this.state.gradeLevels ^ grades // tslint:disable-line:no-bitwise
        }, () => this.beginChangeTimeout());

    }

    renderGrades() {
        const gradeLevels = this.state.gradeLevels;
        const elementarySelected = GradeLevels.contains(gradeLevels, GradeLevels.GradeLevels.Elementary);
        const middleSelected = GradeLevels.contains(gradeLevels, GradeLevels.GradeLevels.Middle);
        const highSelected = GradeLevels.contains(gradeLevels, GradeLevels.GradeLevels.High);

        const tags = [
            <option key={GradeLevels.GradeLevels.NA} onClick={() => this.toggleGrades(GradeLevels.GradeLevels.NA)}>NA</option>,
            <option key={GradeLevels.GradeLevels.Elementary} onClick={() => this.toggleGrades(GradeLevels.GradeLevels.Elementary)}>Elementary</option>,
            <option key={GradeLevels.GradeLevels.Middle} onClick={() => this.toggleGrades(GradeLevels.GradeLevels.Middle)}>Middle</option>,
            <option key={GradeLevels.GradeLevels.High} onClick={() => this.toggleGrades(GradeLevels.GradeLevels.High)}>High</option>,
        ];

        return (
            <select>
                {tags}
            </select>
        );
    }

}