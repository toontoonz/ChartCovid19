import React, { Component } from 'react';
import CanvasJSReact from './assets/canvasjs.react';
import './App.css'
var CanvasJSChart = CanvasJSReact.CanvasJSChart;
 
class ColumnChart extends Component {
	state = {}
  
  
	async componentDidMount() {
	  const url = 'https://disease.sh/v3/covid-19/historical/all?lastdays=90';
	  const res = await fetch(url);
	  const data = await res.json();
	  const arrMonth = [
		"เดือน",
		"มกราคม",
		"กุมภาพันธ์",
		"มีนาคม",
		"เมษายน",
		"พฤษภาคม",
		"มิถุนายน",
		"กรกฎาคม",
		"สิงหาคม",
		"กันยายน",
		"ตุลาคม",
		"พฤศจิกายน",
		"ธันวาคม"
	  ]
	  const arrDate = Object.keys(data.cases);
	  const arrCases = Object.values(data.cases);
	  const arrDeath = Object.values(data.deaths);
	  const arrRecovered = Object.values(data.recovered);
	  // console.log(arrDate)
	  var arrDay = []
	  var firstDay = 0
	  var lastDay = 0
	  var valueFirstCases, valueLastCases, totalCases = 0
	  
  
	  arrDate.forEach(getData);
	  function getData(item, index) {
		if (item.split("/")[0] === "12") {
		  arrDay.push(item)
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
		if (index === firstDay) {
		  valueFirstCases = item
		}
		if (index === lastDay) {
		  valueLastCases = item
		}
	  }
	  var valueFirstDeath, valueLastDeath, totalDeath = 0
	  arrDeath.forEach(getDeathValues);
	  function getDeathValues(item, index) {
		if (index === firstDay) {
		  valueFirstDeath = item
		}
		if (index === lastDay) {
		  valueLastDeath = item
		}
	  }
	  
	  var valueFirstRecovered, valueLastRecovered, totalRecovered = 0
	  arrRecovered.forEach(getRecoverValues);
	  function getRecoverValues(item, index) {
		if (index === firstDay) {
		  valueFirstRecovered = item
		}
		if (index === lastDay) {
		  valueLastRecovered = item
		}
	  }
  
	  totalCases = valueLastCases - valueFirstCases
	  totalDeath = valueLastDeath - valueFirstDeath
	  totalRecovered = valueLastRecovered - valueFirstRecovered
	  this.setState({
		// date: arrMonth[((arrDate[arrDate.length - 1].split("/")[0]) * 1)],
		dateStart: arrDay[0],
		dateEnd: arrDay[arrDay.length - 1],
		cases: totalCases,
		deaths: totalDeath,
		recovered: totalRecovered
  
	  })}
		render() {
		const options = {
			title: {
				text: this.state.dateStart +" - "+ this.state.dateEnd
			},
			animationEnabled: true,
			data: [
			{
				// Change type to "doughnut", "line", "splineArea", etc.
				type: "column",
				dataPoints: [
					{ label: "Cases",  y: this.state.cases  },
					{ label: "Death", y: this.state.deaths  },
					{ label: "Recovered", y: this.state.recovered  }
				]
			}
			]
		}
		
		return (
		<div className="App-Chart">
			<h1>ข้อมูล ผู้ป่วย ติด Covid-19 ทั่วโลก ในแต่ละช่วงเวลา</h1>
			<CanvasJSChart options = {options} />
		</div>

		);
	}
}

export default ColumnChart;