#!/usr/bin/env node
const program = require("commander");
const { exec } = require("child_process");

let xcodecmd = "";
let xcodesetting = "";

program
  .option("-p, --project <project>", "The xcodeproj file for the Xcode project")
  .option(
    "-w, --workspace <workspace>",
    "The xcworkspace file for the Xcode project"
  )
  .option("-s, --scheme <scheme>", "The scheme in the Xcode project");
program.command("show <setting>").action((setting, cmdobj) => {
  if (cmdobj.parent.project == null && cmdobj.parent.workspace == null) {
    process.exit(1);
  }

  if (cmdobj.parent.scheme == null) {
    process.exit(1);
  }

  xcodecmd = "xcodebuild ";
  if (cmdobj.parent.project != null) {
    xcodecmd += ' -project "' + cmdobj.parent.project + '"';
  }
  if (cmdobj.parent.workspace != null) {
    xcodecmd += ' -workspace "' + cmdobj.parent.workspace + '"';
  }
  if (cmdobj.parent.scheme != null) {
    xcodecmd += ' -scheme "' + cmdobj.parent.scheme + '"';
  }
  xcodecmd += " -showBuildSettings";
  xcodesetting = setting;
});

program.parse(process.argv);

exec(xcodecmd, (error, stdout, stderr) => {
  const output = stdout.split("\n");
  const buildSettings = {};
  for (let index = 0; index < output.length; index++) {
    if (output[index].includes("=")) {
      buildSettings[output[index].split("=")[0].trim()] = output[index]
        .split("=")[1]
        .trim();
    }
  }
  console.log(buildSettings[xcodesetting]);
});
