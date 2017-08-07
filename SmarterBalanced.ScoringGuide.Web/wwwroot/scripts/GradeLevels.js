"use strict";
/* tslint:disable:no-bitwise */
Object.defineProperty(exports, "__esModule", { value: true });
var GradeLevels;
(function (GradeLevels) {
    GradeLevels[GradeLevels["NA"] = 0] = "NA";
    GradeLevels[GradeLevels["Grade3"] = 1] = "Grade3";
    GradeLevels[GradeLevels["Grade4"] = 2] = "Grade4";
    GradeLevels[GradeLevels["Grade5"] = 4] = "Grade5";
    GradeLevels[GradeLevels["Grade6"] = 8] = "Grade6";
    GradeLevels[GradeLevels["Grade7"] = 16] = "Grade7";
    GradeLevels[GradeLevels["Grade8"] = 32] = "Grade8";
    GradeLevels[GradeLevels["Grade9"] = 64] = "Grade9";
    GradeLevels[GradeLevels["Grade10"] = 128] = "Grade10";
    GradeLevels[GradeLevels["Grade11"] = 256] = "Grade11";
    GradeLevels[GradeLevels["Grade12"] = 512] = "Grade12";
    GradeLevels[GradeLevels["Elementary"] = 7] = "Elementary";
    GradeLevels[GradeLevels["Middle"] = 56] = "Middle";
    GradeLevels[GradeLevels["High"] = 960] = "High";
    GradeLevels[GradeLevels["All"] = 1023] = "All";
})(GradeLevels = exports.GradeLevels || (exports.GradeLevels = {}));
function caseToString(grade) {
    switch (grade) {
        case GradeLevels.NA: return "NA";
        case GradeLevels.Grade3: return "Grade 3";
        case GradeLevels.Grade4: return "Grade 4";
        case GradeLevels.Grade5: return "Grade 5";
        case GradeLevels.Grade6: return "Grade 6";
        case GradeLevels.Grade7: return "Grade 7";
        case GradeLevels.Grade8: return "Grade 8";
        case GradeLevels.Grade9: return "Grade 9";
        case GradeLevels.Grade10: return "Grade 10";
        case GradeLevels.Grade11: return "Grade 11";
        case GradeLevels.Grade12: return "Grade 12";
        case GradeLevels.Elementary: return "Elementary";
        case GradeLevels.Middle: return "Middle";
        case GradeLevels.High: return "High";
        default: return "";
    }
}
exports.caseToString = caseToString;
function toString(grades) {
    var caseString = caseToString(grades);
    if (caseString !== "") {
        return caseString;
    }
    var gradeStrings = [];
    for (var i = 0; i < 10; i++) {
        if ((grades & 1 << i) === 1 << i) {
            gradeStrings.push(caseToString(1 << i));
        }
    }
    return gradeStrings.join(", ");
}
exports.toString = toString;
function contains(haystack, needle) {
    return (haystack & needle) === needle;
}
exports.contains = contains;
//# sourceMappingURL=GradeLevels.js.map