import bcrypt from "bcryptjs";
var salt = bcrypt.genSaltSync(10);
// TODO: use async to speed up the hashing process
const make = (plain) => {
  return bcrypt.hashSync(plain, salt);
};

const check = (plain, hash) => {
  return bcrypt.compareSync(plain, hash);
};

const Hash = { check, make };

export default Hash;
