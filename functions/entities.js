class FredSeries {
  constructor(id, title, observations) {
    this.id = id;
    this.title = title;
    this.observations = observations;
  }
}

class FredObservation {
  constructor(date, value) {
    this.date = date;
    this.value = value;
  }
}

module.exports = {FredSeries, FredObservation};

