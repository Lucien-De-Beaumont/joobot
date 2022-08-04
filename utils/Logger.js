const dayjs = require("dayjs");
const chalk = require("chalk");

const format = "{tstamp} {tag} {txt}\n";

function error(content) {
  write(content, "black", "bgRed", "ERROR", true);
}
function warn(content) {
  write(content, "black", "bgYellow", "WARN", false);
}
function typo(content) {
  write(content, "black", "bgCyan", "TYPO", false);
}
function buttons(content) {
  write(content, "black", "bgWhite", "BUTTONS", false);
}
function command(content) {
  write(content, "black", "bgMagenta", "COMMAND", false);
}
function event(content) {
  write(content, "black", "bgGreen", "EVENT", false);
}
function client(content) {
  write(content, "black", "bgBlue", "CLIENT", false);
}
function server(content) {
  write(content, "black", "bgBlue", "SERVER", false);
}

function write(content, tagColor, bgTagColor, tag, error = false) {
  const timestamp = `[${dayjs().format("DD/MM - HH:mm:ss")}]`;
  const logTag = `[${tag}]`;
  const stream = error ? process.stderr : process.stdout;

  const item = format
    .replace("{tstamp}", chalk.gray(timestamp))
    .replace("{tag}", chalk[bgTagColor][tagColor](logTag))
    .replace("{txt}", chalk.white(content));

  stream.write(item);
}

module.exports = { error, warn, command, event, buttons, typo, client, server };
