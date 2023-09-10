const r = /\d+/g;
const s = "you can enter 333 maximum 500 choices";
let m = r.exec(s);
// while ((m = r.exec(s)) != null) {
alert(m[0]);
// }