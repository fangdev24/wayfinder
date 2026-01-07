#!/usr/bin/env node
/**
 * Populate Solid Pod Profiles with Demo Data
 *
 * This script authenticates to the local CSS server and adds
 * profile data (name, role, email, skills) to each demo account.
 *
 * Run: node populate-profiles.js
 */

const POD_SERVER = 'http://localhost:3002';

// Demo profile data matching the app's data source
const profiles = [
  {
    name: 'flint-rivers',
    email: 'flint.rivers@standards.demo.gov.example',
    password: 'demo123',
    displayName: 'Flint Rivers',
    role: 'Senior Data Engineer',
    skills: 'Python, Spark, Data Architecture, AWS',
  },
  {
    name: 'river-stone',
    email: 'river.stone@citizen-support.demo.gov.example',
    password: 'demo123',
    displayName: 'River Stone',
    role: 'Lead Data Engineer',
    skills: 'Azure, Databricks, Python, Team Leadership',
  },
  {
    name: 'ash-morgan',
    email: 'ash.morgan@revenue.demo.gov.example',
    password: 'demo123',
    displayName: 'Ash Morgan',
    role: 'Data Engineer',
    skills: 'Python, SQL, ETL, AWS Glue',
  },
  {
    name: 'slate-wylder',
    email: 'slate.wylder@identity.demo.gov.example',
    password: 'demo123',
    displayName: 'Slate Wylder',
    role: 'Principal Data Engineer',
    skills: 'Architecture, Security, GCP, Kubernetes',
  },
  {
    name: 'heath-willows',
    email: 'heath.willows@health-data.demo.gov.example',
    password: 'demo123',
    displayName: 'Heath Willows',
    role: 'Data Engineer',
    skills: 'Healthcare Data, HL7, FHIR, Python',
  },
];

async function getCredentialsUrl() {
  // Get the server's controls to find the credentials endpoint
  const response = await fetch(`${POD_SERVER}/.account/`);
  const data = await response.json();
  return data.controls?.password?.login;
}

async function login(email, password, credentialsUrl) {
  const response = await fetch(credentialsUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error(`Login failed: ${response.status} ${await response.text()}`);
  }

  const data = await response.json();
  return data.authorization;
}

async function updateProfile(podName, authorization, profileData) {
  const profileUrl = `${POD_SERVER}/${podName}/profile/card`;

  // SPARQL UPDATE to add profile data
  const sparqlUpdate = `
    PREFIX foaf: <http://xmlns.com/foaf/0.1/>
    PREFIX vcard: <http://www.w3.org/2006/vcard/ns#>

    INSERT DATA {
      <${profileUrl}#me>
        foaf:name "${profileData.displayName}" ;
        vcard:fn "${profileData.displayName}" ;
        vcard:role "${profileData.role}" ;
        vcard:hasEmail <mailto:${profileData.email}> ;
        vcard:note "${profileData.skills}" .
    }
  `;

  const response = await fetch(profileUrl, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/sparql-update',
      Authorization: `CSS-Account-Token ${authorization}`,
    },
    body: sparqlUpdate,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Failed to update profile: ${response.status} ${text}`);
  }

  return true;
}

async function main() {
  console.log('Populating Solid Pod profiles with demo data...\n');

  try {
    // Get the credentials URL from the server
    const credentialsUrl = await getCredentialsUrl();
    if (!credentialsUrl) {
      console.error('Could not find credentials endpoint. Is CSS running?');
      process.exit(1);
    }
    console.log(`Found credentials endpoint: ${credentialsUrl}\n`);

    for (const profile of profiles) {
      process.stdout.write(`${profile.displayName}... `);

      try {
        // Login to get authorization token
        const authorization = await login(profile.email, profile.password, credentialsUrl);

        // Update the profile
        await updateProfile(profile.name, authorization, profile);

        console.log('OK');
      } catch (error) {
        console.log(`FAILED: ${error.message}`);
      }
    }

    console.log('\nDone! Profiles populated.');
    console.log('\nVerify with:');
    console.log(`  curl ${POD_SERVER}/flint-rivers/profile/card -H "Accept: text/turtle"`);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main();
