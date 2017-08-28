import * as GradeLevels from '../src/GradeLevels';

it('caseToString for grade 3', () => {
    const grade = GradeLevels.caseToString(GradeLevels.GradeLevels.Grade3);
    expect(grade).toBe("Grade 3");
});

it('caseToString for high school', () => {
    const grade = GradeLevels.caseToString(GradeLevels.GradeLevels.High);
    expect(grade).toBe("High");
});

it("contains false for GradeLevels", () => {
    const gradeToFind = GradeLevels.GradeLevels.Elementary;
    const grade = GradeLevels.contains(GradeLevels.GradeLevels.Grade10, gradeToFind);
    expect(grade).toBe(false);
});

it("contains true for GradeLevels", () => {
    const gradeToFind = GradeLevels.GradeLevels.Elementary;
    const grade = GradeLevels.contains(GradeLevels.GradeLevels.All, gradeToFind);
    expect(grade).toBe(true);
});