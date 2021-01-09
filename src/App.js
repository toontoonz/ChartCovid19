import React, { Component } from 'react';
import CanvasJSReact from './assets/canvasjs.react';
import './App.css'
var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

class App extends Component {
	constructor(prop) {
		super(prop)
		this.state = {
			Cases: [],
			Death: [],
			Recovered: [],
			Day: [],
			firstDay: 0,
			lastDat: 0,
			valueFirstCases: 0,
			valueLastCases: 0,
			totalCases: 0
		}
	}



	async componentDidMount() {
		const url = 'https://disease.sh/v3/covid-19/historical/all?lastdays=90';
		const res = await fetch(url);
		const data = await res.json();
		const arrDate = Object.keys(data.cases);
		const arrCases = Object.values(data.cases);
		const arrDeath = Object.values(data.deaths);
		const arrRecovered = Object.values(data.recovered);

		var Day = this.state.Day
		var firstDay = this.state.firstDay
		var lastDay = this.state.lastDay
		var Cases = this.state.Cases
		var Death = this.state.Death
		var Recovered = this.state.Recovered
		arrDate.forEach(getData);
		function getData(item, index) {
			if (item.split("/")[0] === "12") {
				Day.push(item)
				if (item.split("/")[1] === "1") {
					firstDay = index
				}
				if (item.split("/")[1] === "31") {
					lastDay = index
				}
			}
		}
		arrCases.forEach(getDataValues);
		function getDataValues(item, index) {
			if (index >= firstDay && index <= lastDay) {
				Cases.push(item)
			}
		}
		arrDeath.forEach(getDeathValues);
		function getDeathValues(item, index) {
			if (index >= firstDay && index <= lastDay) {
				Death.push(item)
			}
		}
		arrRecovered.forEach(getRecoverValues);
		function getRecoverValues(item, index) {
			if (index >= firstDay && index <= lastDay) {
				Recovered.push(item)
			}
		}

		this.state.Day = Day
		this.state.firstDay = firstDay
		this.state.lastDat = lastDay
		this.state.Cases = Cases
		this.state.Death = Death
		this.state.Recovered = Recovered
		this.getData()
	}

	getData() {
		var i = 0;
		setInterval(() => {
			this.setState({
				dateNow: this.state.Day[i],
				cases: this.state.Cases[i],
				deaths: this.state.Death[i],
				recovered: this.state.Recovered[i]

			})
			if (i === 30) {
				i = 0
			} else {
				i++
			}

		}, 300);

	}
	render() {

		const options = {
			title: {
				text: this.state.dateNow
			},
			animationEnabled: true,
			data: [
				{
					type: "bar",
					dataPoints: [
						
						{ y: this.state.deaths, label: "Death" },
						{ y: this.state.recovered, label: "Recovered" },
						{ y: this.state.cases, label: "Cases" },
					]
				}
			]
		}

		return (
			<div className="App-Chart">
				<h1>ข้อมูล ผู้ป่วย ติด Covid-19 ทั่วโลก ในแต่ละช่วงเวลา</h1>
				<CanvasJSChart options={options} />
			</div>

		);
	}
	addSymbols(e){
		var suffixes = ["", "K", "M", "B"];
		var order = Math.max(Math.floor(Math.log(e.value) / Math.log(1000)), 0);
		if(order > suffixes.length - 1)
			order = suffixes.length - 1;
		var suffix = suffixes[order];
		return CanvasJS.formatNumber(e.value / Math.pow(1000, order)) + suffix;
	}
}

export default App;