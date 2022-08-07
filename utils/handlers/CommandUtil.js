const { promisify } = require("util");
const { glob } = require("glob");
const pGlob = promisify(glob);
const Logger = require("../Logger");

module.exports = async (client) => {
  (await pGlob(`${process.cwd()}/commands/*.js`)).map(async (commandFile) => {
    const cmd = require(commandFile);

    if (!cmd.name) return Logger.warn(`${cmd.name}.js ➡  pas de nom`);
    if (!cmd.description && cmd.type == null) { return Logger.warn(`${cmd.name}.js ➡  pas de description`); }

    if (cmd.underConstruction != true) {
      return client.slashCommands.set(cmd.name, cmd)
    } else {
      return client.commands.set(cmd.name, cmd)
    }

    Logger.command(`${cmd.name}.js`);
  });
};
