sfdx org create scratch -a chartjsforce -f config/project-scratch-def.json -d
sfdx project deploy start
sfdx apex run -f scripts/apex/productSetup.apex
sfdx apex run -f scripts/apex/opportunitySetup.apex
