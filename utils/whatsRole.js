import roles from "../roles.config.js";

const whatsRole = (stringRole) => {
  const trimmed = stringRole.toLowerCase().trim();

  if (!trimmed.includes(",")) {
    if (!roles.includes(trimmed))
      return new Error(`Role ${trimmed} tidak ada!`);

    return [trimmed];
  }

  return trimmed.split(",").map((role) => {
    const trimmedRole = role.trim();

    if (!roles.includes(trimmedRole))
      return new Error(`Role ${trimmed} tidak ada!`);

    return trimmedRole;
  });
};

export default whatsRole;
