// Write your code here
import {Component} from 'react'
import Loader from 'react-loader-spinner'

import VaccinationByAge from '../VaccinationByAge'
import VaccinationByGender from '../VaccinationByGender'
import VaccinationCoverage from '../VaccinationCoverage'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class CowinDashboard extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    fetchedData: {},
  }

  componentDidMount() {
    this.getCowinData()
  }

  getCowinData = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const res = await fetch('https://apis.ccbp.in/covid-vaccination-data')
    const data = await res.json()
    if (res.ok === true) {
      const apiData = {
        coverageData: data.last_7_days_vaccination,
        byGenderData: data.vaccination_by_gender,
        byAgeData: data.vaccination_by_age,
      }

      this.setState({
        fetchedData: apiData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderRecharts = () => {
    const {fetchedData} = this.state
    const {coverageData, byAgeData, byGenderData} = fetchedData

    return (
      <>
        <VaccinationCoverage coverageDetails={coverageData} />
        <VaccinationByGender vaccinationGenderDetails={byGenderData} />
        <VaccinationByAge vaccinationAgeDetails={byAgeData} />
      </>
    )
  }

  renderFailureView = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png"
        alt="failure view"
        className="fail-img"
      />
      <h1 className="fail-heading">Something went wrong</h1>
    </div>
  )

  renderLoader = () => (
    <div data-testid="loader" className="loader">
      <Loader type="ThreeDots" color="#ffffff" height={80} width={80} />
    </div>
  )

  renderVaccinationDetails = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderRecharts()
      case apiStatusConstants.inProgress:
        return this.renderLoader()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="dashboard-container">
        <div className="cowin-logo-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/cowin-logo.png"
            alt="website logo"
            className="website-logo"
          />
          <p className="logo-heading">Co-WIN</p>
        </div>
        <h1 className="main-heading">CoWIN Vaccination in India</h1>
        <div className="charts-con">{this.renderVaccinationDetails()}</div>
      </div>
    )
  }
}

export default CowinDashboard
