#!/usr/bin/env node

const { execSync } = require('child_process');
const readline = require('readline');

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Function to get current branch
function getCurrentBranch() {
  try {
    return execSync('git branch --show-current', { encoding: 'utf-8' }).trim();
  } catch (error) {
    console.error('Error getting current branch:', error.message);
    process.exit(1);
  }
}

// Function to check if a branch exists locally
function branchExistsLocally(branchName) {
  try {
    const branches = execSync('git branch --list', { encoding: 'utf-8' });
    return branches.split('\n').some(branch => branch.trim().replace('*', '').trim() === branchName);
  } catch (error) {
    console.error('Error checking local branches:', error.message);
    return false;
  }
}

// Function to check if a branch exists remotely
function branchExistsRemotely(branchName) {
  try {
    const remotes = execSync(`git ls-remote --heads origin ${branchName}`, { encoding: 'utf-8' });
    return remotes.trim() !== '';
  } catch (error) {
    console.error('Error checking remote branches:', error.message);
    return false;
  }
}

// Function to delete local branch
function deleteLocalBranch(branchName) {
  try {
    console.log(`Deleting local branch: ${branchName}`);
    const result = execSync(`git branch -D ${branchName}`, { encoding: 'utf-8' });
    console.log(result);
    console.log(`✓ Local branch ${branchName} deleted successfully`);
  } catch (error) {
    console.error(`✗ Error deleting local branch ${branchName}:`, error.message);
  }
}

// Function to delete remote branch
function deleteRemoteBranch(branchName) {
  try {
    console.log(`Deleting remote branch: ${branchName} on origin`);
    const result = execSync(`git push origin --delete ${branchName}`, { encoding: 'utf-8' });
    console.log(result);
    console.log(`✓ Remote branch ${branchName} deleted successfully`);
  } catch (error) {
    console.error(`✗ Error deleting remote branch ${branchName}:`, error.message);
  }
}

// Main function
async function main() {
  const currentBranch = getCurrentBranch();
  
  console.log('Git Branch Deletion Script');
  console.log('==========================');
  console.log(`Current branch: ${currentBranch}\n`);

  // Get branch name from command line argument or prompt user
  const branchName = process.argv[2];
  
  if (!branchName) {
    console.log('Usage: node delete-branch.js <branch-name>');
    console.log('   or: node delete-branch.js (to be prompted for branch name)');
    console.log('');
    
    rl.question('Enter the branch name to delete: ', (inputBranchName) => {
      const branchToDelete = inputBranchName.trim();
      
      if (!branchToDelete) {
        console.log('No branch name provided. Exiting.');
        rl.close();
        process.exit(1);
      }
      
      confirmAndDelete(branchToDelete);
    });
  } else {
    confirmAndDelete(branchName);
  }
}

function confirmAndDelete(branchName) {
  const localExists = branchExistsLocally(branchName);
  const remoteExists = branchExistsRemotely(branchName);
  
  if (!localExists && !remoteExists) {
    console.log(`Branch "${branchName}" does not exist locally or remotely. Nothing to delete.`);
    rl.close();
    process.exit(0);
  }
  
  console.log(`\nBranch to delete: ${branchName}`);
  console.log(`Exists locally: ${localExists ? 'Yes' : 'No'}`);
  console.log(`Exists remotely: ${remoteExists ? 'Yes' : 'No'}`);
  
  if (branchName === getCurrentBranch()) {
    console.log(`\n⚠️  WARNING: You are currently on the branch "${branchName}".`);
    console.log('You need to switch to another branch before deleting this one.');
    rl.close();
    process.exit(1);
  }
  
  rl.question('\nDo you want to proceed with deletion? (yes/no): ', (answer) => {
    if (answer.toLowerCase() === 'yes' || answer.toLowerCase() === 'y') {
      console.log(`\nDeleting branch: ${branchName}`);
      
      if (localExists) {
        deleteLocalBranch(branchName);
      }
      
      if (remoteExists) {
        deleteRemoteBranch(branchName);
      }
      
      console.log(`\nBranch "${branchName}" deletion process completed.`);
    } else {
      console.log('Deletion cancelled by user.');
    }
    
    rl.close();
  });
}

// Run the main function
main().catch(error => {
  console.error('Unexpected error:', error);
  process.exit(1);
});