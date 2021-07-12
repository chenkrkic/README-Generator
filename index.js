const inquirer = require('inquirer');
const fs = require('fs');
const generateMarkdown = require('./utils/generateMarkdown.js');

const questions = [
    {
        type: 'input',
        name: 'title',
        message: 'Please provide a title name. (Required)',
        validate: titleInput => {
            if (titleInput) {
                return true;
            } else {
                console.log('Please provide a title name!');
                return false;
            }
        }
    },
    {
        type: 'input',
        name: 'github',
        message: 'Please provide your GitHub username. (Required)',
        validate: githubInput => {
            if (githubInput) {
                return true;
            } else {
                console.log('Please provide your GitHub username!');
                return false;
            }
        }
    },
    {
        type: 'input',
        name: 'link',
        message: 'Please provide a GitHub link to this project. (Required)',
        when: ({contents}) => {
            if (contents.indexOf('Deployed Application') > -1) {
                return true;
            } else {
                return false;
            }
        },
        validate: linkInput => {
            if (linkInput) {
                return true;
            } else {
                console.log('Please provide a link!');
                return false;
            }
        }
    },
    {
        type: 'input',
        name: 'description',
        message: 'Please provide a description for this application. (Required)',
        validate: descInput => {
            if (descInput) {
                return true;
            } else {
                console.log('Please provide a description for this application!');
                return false;
            }
        }
    },
    {
        type: 'checkbox',
        name: 'languages',
        message: 'What did you this project with? (Check all that apply)',
        choices: ['JavaScript', 'HTML', 'CSS', 'ES6', 'jQuery', 'Bootstrap', 'Node']
    },
    {
        type: 'checkbox',
        name: 'contents',
        message: 'Any additional sections you would like to include in your README?',
        choices: [
            {
                name: 'Deployed Application',
                checked: false
            },
            {
                name: 'Installation',
                checked: false
            },
            {
                name: 'Screenshots',
                checked: true
            },
            {
                name: 'Built With',
                checked: true
            },
            {
                name: 'License',
                checked: false
            },
            {
                name: 'Contributing',
                checked: false
            },
            {
                name: 'Tests',
                checked: false
            },
            {
                name: 'Questions',
                checked: true
            },
            {
                name: 'Credits',
                checked: true
            }
        ]
    },
    {
        type: 'input',
        name: 'installation',
        message: 'Please provide any packages for installation of this application.',
        when: ({ contents }) => {
            if (contents.indexOf('Installation') > -1) {
                return true;
            } else {
                return false;
            }
        },
        validate: installInput => {
            if (installInput) {
                return true;
            } else {
                console.log('Please provide installation instructions!');
                return false;
            }
        }
    },
    {
        type: 'input',
        name: 'usage',
        message: 'Please provide information for using your application. (Required)',
        validate: usageInput => {
            if (usageInput) {
                return true;
            } else {
                console.log('Please provide information for using your application!');
                return false;
            }
        }
    },
    {
        type: 'list',
        name: 'license',
        message: 'Please provide license information.',
        choices: ['MIT', 'GNU', 'Apache 2.0', 'ISC'],
        default: 0,
        when: ({ contents }) => {
            if (contents.indexOf('License') > -1) {
                return true;
            } else {
                return false;
            }
        },
        validate: licenseInput => {
            if (licenseInput) {
                return true;
            } else {
                console.log('Please provide license information!');
                return false;
            }
        }
    },
    {
        type: 'input',
        name: 'contribution',
        message: 'Please provide the guidelines for contribution.',
        when: ({ contents }) => {
            if (contents.indexOf('Contribution') > -1) {
                return true;
            } else {
                return false;
            }
        },
        validate: contributionInput => {
            if (contributionInput) {
                return true;
            } else {
                console.log('Please provide the guidelines for contribution!');
                return false;
            }
        }
    },
    {
        type: 'input',
        name: 'tests',
        message: 'Please provide test information for this application.',
        when: ({ contents }) => {
            if (contents.indexOf('Tests') > -1) {
                return true;
            } else {
                return false;
            }
        },
        validate: testsInput => {
            if (testsInput) {
                return true;
            } else {
                console.log('Please provide test information for this application!');
                return false;
            }
        }
    },
    {
        type: 'input',
        name: 'questions',
        message: 'Please provide an email address for others to reach you with additional questions.',
        when: ({ contents }) => {
            if (contents.indexOf('Questions') > -1) {
                return true;
            } else {
                return false;
            }
        },
        validate: questionsInput => {
            if (questionsInput) {
                return true;
            } else {
                console.log('Please provide an email address!');
                return false;
            }
        }
    }
];

const screenshotQues = [
    {
        type: 'input',
        name: 'screenshotLink',
        message: 'Please provide a link for your screenshot. (Required)',
        validate: screenshotLinkInput => {
            if (screenshotLinkInput) {
                return true;
            } else {
                console.log('Please provide a link for your screenshot!')
                return false;
            }
        }
    },
    {
        type: 'input',
        name: 'screenshotAlt',
        message: 'Please provide alt text for your screenshot. (Required)',
        validate: screenshotAltInput => {
            if (screenshotAltInput) {
                return true;
            } else {
                return false;
            }
        }
    },
    {
        type: 'input',
        name: 'screenshotDesc',
        message: 'Please provide a description of your screenshot. (Optional)'
    },
    {
        type: 'confirm',
        name: 'confirmAddScreenshot',
        message: 'Would you like to add another screenshot?',
        default: false
    }
];

addScreenshots = readmeData => {
    if (!readmeData.screenshots) {
        readmeData.screenshots = [];
    }

    console.log(`
==================
Add New Screenshot
==================
    `);
    return inquirer.prompt(screenshotQues)
        .then(screenshotData => {
            readmeData.screenshots.push(screenshotData);
            if (screenshotData.confirmAddScreenshot) {
                return addScreenshots(readmeData);
            } else {
                return readmeData;
            };
        });
};

function writeToFile(fileName, data) {
    fs.writeFile(`./dist/${fileName}`, data, err => {
        if (err) {
            throw err;
        };
        console.log('README has been created!')
    });
};

function init() {
    return inquirer.prompt(questions);
};

init()
    .then(userResponse => {
        if (userResponse.contents.indexOf('Screenshots') > -1) {
            return addScreenshots(userResponse);
        } else {
            return userResponse;
        }
    })
    .then(answers => generateMarkdown(answers))
    .then(generatedReadme => writeToFile('README.md', generatedReadme))
    .catch(err => {
        console.log(err);
    });