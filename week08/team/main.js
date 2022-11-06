
var next = '';
var previous;
var pages = {};
var currentPage = 1;

async function getPeople(url) {
	
	const response = await fetch(url);
	
	if (response.ok) {
		people = await response.json();
	}

	let counter = 3;
	pages[1] = url;
	pages[2] = people.next;

	while(people.next !== null) {
		const response = await fetch(people.next);
	
		if (response.ok) {
			people = await response.json();
			pages[counter] = people.next;
		}
		counter++;
	}
	console.log(pages);
	getData(pages[1]);
}

async function getData(url) {
  let response = await fetch(url);

  if (response.ok) {
    let data = await response.json();
    next = data.next;
    previous = data.previous;
    console.log(data);
    displayData(data);
  } else {
    throw Error(await response.text());
  }
}

function nextPage() {
	currentPage++;
	getData(pages[currentPage]);
}

function previousPage() {
	currentPage--;
	getData(pages[currentPage]);

}

function displayData(people) {

	data.innerHTML = "";

	people.results.forEach(element => {
		let name = document.createElement("h3")
		let height = document.createElement("p")
		let mass = document.createElement("p")
		let hair_color = document.createElement("p")
		let skin_color = document.createElement("p")
		let eye_color = document.createElement("p")
		let birth_year = document.createElement("p")
		let gender = document.createElement("p")
		let hr = document.createElement("hr");

		
		name.innerHTML = `${element.name}`
		height.innerHTML = `Height: ${element.height}`
		mass.innerHTML = `Mass: ${element.mass}`
		hair_color.innerHTML = `Hair Color: ${element.hair_color}`
		skin_color.innerHTML = `Skin Color: ${element.skin_color}`
		eye_color.innerHTML = `Eye Color: ${element.eye_color}`
		birth_year.innerHTML = `Birth Year: ${element.birth_year}`
		gender.innerHTML = `Gender: ${element.gender}`


		data.appendChild(name);
		data.appendChild(height);
		data.appendChild(mass);
		data.appendChild(hair_color);
		data.appendChild(skin_color);
		data.appendChild(eye_color);
		data.appendChild(birth_year);
		data.appendChild(gender);
		data.appendChild(hr);






		console.log(element)
	});

	console.log(people.results[0]);

}


getPeople("https://swapi.dev/api/people")