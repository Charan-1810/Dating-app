export const CITIES = [
  "Bengaluru", "Chennai", "Delhi NCR", "Hyderabad",
  "Kolkata", "Mumbai", "Pune", "Other",
];

export const GENDERS = [
  { value: "woman", label: "Woman" },
  { value: "man", label: "Man" },
  { value: "non-binary", label: "Non-binary" },
];

export const INTERESTED_IN = [
  { value: "women", label: "Women" },
  { value: "men", label: "Men" },
  { value: "everyone", label: "Everyone" },
];

export const INTENTS = [
  { value: "long-term", label: "Long-term relationship" },
  { value: "short-term", label: "Something casual" },
  { value: "friendship", label: "New friends" },
  { value: "figuring-out", label: "Still figuring it out" },
];

export function getAge(birthdate) {
  const today = new Date();
  const dob = new Date(birthdate);
  let age = today.getFullYear() - dob.getFullYear();
  const hadBirthday =
    today.getMonth() > dob.getMonth() ||
    (today.getMonth() === dob.getMonth() && today.getDate() >= dob.getDate());
  return hadBirthday ? age : age - 1;
}