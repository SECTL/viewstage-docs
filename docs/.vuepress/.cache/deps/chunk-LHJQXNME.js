// node_modules/.pnpm/vuepress-theme-reco@2.0.0-r_64746607b454dc2dae16952a4a1b3334/node_modules/vuepress-theme-reco/lib/client/utils/other.js
function formatISODate(ISODate = "") {
  const dateStr = ISODate.replace("T", " ").replace("Z", "").split(".")[0];
  const formatDateStr = dateStr.replace(/(\s00:00:00)$/, "");
  return formatDateStr;
}

export {
  formatISODate
};
//# sourceMappingURL=chunk-LHJQXNME.js.map
