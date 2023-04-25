async function getApi(userName) {
	const response = await fetch(
		`https://api.github.com/users/GabryelleSS/repos`,
		{
			method: 'GET',
		}
	);
	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	}

	const data = await response.json();

	if (!data || !data.length) {
		throw new Error(`User not found`);
	}

  return data;
}

export default getApi;