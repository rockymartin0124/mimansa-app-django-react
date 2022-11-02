import { jsonQuery, query, getLocalToken, generatePagenationParameters } from "./common";

// const toUpper = dict => {
//   let new_dict = {};
//   Object.keys(dict).map((key) => {
//     new_dict[key] = typeof dict[key] === 'string' ? dict[key].toUpperCase(): dict[key];
//   })
//   return new_dict;
// }

// export const getMemberInfoFromLocal = () => {
//   const token = getLocalToken();
//   const userInfo = token ? token.member : null;
//   return userInfo;
// }

// export async function apiUpdateNews(id, data) {
//   return await jsonQuery(`/news/${id}/`, 'PUT', data);
// }
// export async function apiNewsCreate(data) {
//   const res = await jsonQuery(`/news/create/`, 'POST', data, true);
//   return res;
// }
// export async function apiDeleteNewsById(id) {
//   return await jsonQuery(`/news/${id}/`, 'DELETE', {}, true);
// }
// export async function apiGetLessonById(id) {
//   return await query(`/lesson/${id}/`);
// }


export async function apiValidateUserId(searchParams) {
  return await query(`/user`, {searchParams});
  // return await query(`/user`, {searchParams: toUpper(searchParams)});
}
export async function apiValidateLocation(searchParams) {
  return await query(`/location`, {searchParams});
}
export async function apiValidateLPNId(searchParams) {
  return await query(`/tote`, {searchParams});
}
export async function apiValidateSKU(searchParams) {
  return await query(`/sku`, {searchParams});
}
export async function apiValidateActionCode(searchParams) {
  return await query(`/action_code`, {searchParams: searchParams, method: 'POST'});
}
export async function apiValidatePackCarton(searchParams) {
  return await query(`/pack_carton`, {searchParams: searchParams, method: 'POST'});
}
export async function apiCancelTote(searchParams) {
  return await query(`/cancel_tote`, {searchParams: searchParams, method: 'POST'});
}
export async function apiValidatePrintCarton(searchParams) {
  return await query(`/print_carton`, {searchParams: searchParams, method: 'POST'});
}
export async function apiGetToteDetails(searchParams) {
  return await query(`/tote_details`, {searchParams});
}

