const inquirer = require("inquirer");
const fs = require("fs");
const util = require("util");
const writeFileAsync = util.promisify(fs.writeFile)

function promptUser() {
    return inquirer.prompt([
      {
        type: "input",
        name: "title",
        message: "What is the title of the project?"
      },
      {
        type: "input",
        name: "description",
        message: "Give a brief description of the project?"
      },
      {
        type: "input",
        name: "installation",
        message: "Full description on how to install: "
      },
      {
        type: "input",
        name: "usage",
        message: "How will this project be used?"
      },
      {
        type: "input",
        name: "contributions",
        message: "List everyone who contributed to this project: "
      },
      {
        type: "input",
        name: "tests",
        message: "What tests have you run on this project?"
      },
      {
        type:"checkbox",
        message: "Which license would you like to use?",
        choices:[
            {message: "MIT", name:"MIT"},
            {message: "Mozilla Public License 2.0", name:"Mozilla"},
            {message: "The Unlicense", name:"unlicense"}
        ],
        name: "license"
      },
      {
        type: "input",
        name: "email",
        message: "Enter your email address: "
      },
      {
        type: "input",
        name: "githubUsername",
        message: "Enter your GitHub Username: "
      },
      {
        type: "input",
        name: "questions",
        message: "Please enter any questions that you have: "
      },
    ]);
}

function generateMD(response) {
    const title = response.title;
    const description = response.description;
    const install = response.installation;
    const use = response.usage;
    const contrib = response.contributions;
    const tests = response.tests;
    const license = response.license;
    const userEmail = response.email;
    const userGit = response.githubUsername;
    const question = response.questions;
    let licenseIcon ="";

    if (license == "MIT") {
        licenseIcon = "[![MIT License](https://opensource.org/files/osi_keyhole_300X300_90ppi_0.png)](https://opensource.org/licenses/MIT)";
    } else if (license == "unlicense") {
        licenseIcon = "[![The Unlicense](https://unlicense.org/pd-icon.png)](https://unlicense.org/)";
    } else if (license == "Mozilla") {
        licenseIcon = "[![Mozilla Public License 2.0](data:image/png;base64,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)](https://www.mozilla.org/en-US/MPL/2.0/)";
    }

    return `
# ${licenseIcon}    
# ${title}           
       
## Description
 ${description}

## Table of Contents
 * [Installation](#installation)
 * [Usage](#usage)
 * [License](#license) 
 * [Contributing](#contributing)
 * [Tests](#tests)
 * [Contact](#contact)
            
## Installation
 ${install}
                
## Usage
 ${use}
        
## License 
 ${license}
        
## Contributing
 ${contrib} contributed to this project
                
## Tests
 ${tests}
        
## Contact
* [${userGit}](https://github.com/${userGit})
* ${userEmail}
        
`;

}

async function init() {
    console.log("hello")
    try {
      const response = await promptUser();
  
      const md = generateMD(response);
  
      await writeFileAsync("README.md", md);
  
      console.log("Successfully generated your README.md");
    } catch(err) {
      console.log(err);
    }
  }
  
  init();
  
       


  
  




