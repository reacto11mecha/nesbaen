const SUBJECTS = ["IPA", "IPS", "BAHASA"];

const createGradeClass = (length, subjectIDX) => {
  if (length > 1) {
    const dummyArray = Array.from(new Array(length));

    return dummyArray.map((_, idx) => ({
      name: `${SUBJECTS[subjectIDX]} ${++idx}`,
    }));
  }

  return { name: `${SUBJECTS[subjectIDX]}` };
};

const currentAvailableClass = [
  {
    gradeName: "X",
    classNames: [
      ...createGradeClass(6, 0),
      ...createGradeClass(4, 1),
      createGradeClass(1, 2),
    ],
  },
];

export default currentAvailableClass;
export { SUBJECTS, createGradeClass };
