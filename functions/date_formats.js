const {format, parseISO} = require("date-fns");

function isoTimestampString(date) {
  return format(new Date(date), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx");
}

function optionalDate(dateStr) {
  return dateStr ? parseISO(dateStr) : null;
}

function yyyyMmDd(date) {
  return format(new Date(date), "yyyy-MM-dd");
}

module.exports = {isoTimestampString, optionalDate, yyyyMmDd};
