const accountType = document.querySelector('#account-type');
const runnerCheckbox = document.querySelector('#runner-chk');
const volunteerCheckbox = document.querySelector('#volunteer-chk');

runnerCheckbox.addEventListener('change', () => {
  if (runnerCheckbox.checked) {
    accountType.value = 'volunteers';
    volunteerCheckbox.checked = false;
  }
  console.log("runner checked");
});

volunteerCheckbox.addEventListener('change', () => {
  if (volunteerCheckbox.checked) {
    accountType.value = 'runners';
    runnerCheckbox.checked = false;
  }
  console.log("volunteer checked");
})