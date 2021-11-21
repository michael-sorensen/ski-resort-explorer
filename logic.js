allResorts = resorts.concat(asiaResorts);

// Weather API call
function weatherAPI() {
    allResorts.forEach(function(resort) {
        const settings = {
            "async": true,
            "crossDomain": true,
            "url": `https://api.weatherapi.com/v1/forecast.json?key=2bcd9e5d13204726acf52726212010&q=${resort.lat},${resort.lng}&days=1&aqi=no&alerts=no`,
            "method": "GET"
        };


        $.ajax(settings).done(function(response) {
            base = response.current
            forecast = response.forecast.forecastday[0]['day']
            resort.CurrentTemp = base['temp_f'],
                resort.CurrentWeather = base['condition']['text'],
                resort.CurrentSnow = base['precip_in'],
                resort.CurrentWind = base['wind_mph'],
                resort.tomTemp = forecast['avgtemp_f'],
                resort.tomWeather = forecast['condition']['text'],
                resort.tomSnow = forecast['daily_chance_of_snow']
        })
    })
};

allResorts.forEach(function(resort) {
    var x = (resort.CurrentTemp === 'undefined') ? "--" : x;
});

// Create large resort icon
var lgResortIcon = L.icon({
    iconUrl: 'images/MapMTN.png',
    iconSize: [27.56061, 38.5], // size of the icon
    ico0chor: [0, 0], // point of the icon which will correspond to marker's location
    popupAnchor: [15, 0] // point from which the popup should open relative to the ico0chor
});

// Create small resort icon
var smResortIcon = L.icon({
    iconUrl: 'images/smMapMTN.svg',
    iconSize: [21.4758, 30], // size of the icon
    ico0chor: [0, 0], // point of the icon which will correspond to marker's location
    popupAnchor: [15, 0] // point from which the popup should open relative to the ico0chor
});

// Add snow layer from OWM
var snowLayer = L.tileLayer('http://tile.openweathermap.org/map/snow_new/{z}/{x}/{y}.png?appid=d22d9a6a3ff2aa523d5917bbccc89211', {
    maxZoom: 18,
    temperatureUnit: 'F',
    popup: true,
    progressControl: true,
    legend: true,
    attribution: '&copy; <a href="http://owm.io">VANE</a>'
});


// Add temp layer from OWM
var tempLayer = L.tileLayer('http://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=d22d9a6a3ff2aa523d5917bbccc89211', {
    maxZoom: 18,
    temperatureUnit: 'F',
    popup: true,
    progressControl: true,
    legend: true,
    attribution: '&copy; <a href="http://owm.io">VANE</a>'
});


// Add dark map layer as "customMap"
var customMap = L.tileLayer("https://api.mapbox.com/styles/v1/michaelsorensen/ckusmane89lcg17mlbi67w15s/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
    accessToken: API_KEY
});


// Create arrays to hold resorts
lgResorts = [];
smResorts = [];

// Populate array of large resorts
resorts.forEach(function(resort) {
    if (resort.acres_total >= 600) {
        lgResorts.push(resort);
    }
});

// Populate array of small resorts
resorts.forEach(function(resort) {
    if (resort.acres_total < 600 || resort.acres_total == null) {
        smResorts.push(resort);
    }
});

// Create markers for large resorts
var lgMarkers = [];
lgResorts.forEach(
    function(resort) {
        lgMarkers.push(
            L.marker([resort.lat, resort.lng], { icon: lgResortIcon })
            .on({
                click: function(e) {
                    $("#feature-title").html(`${resort.name}`);
                    $("#feature-info").html(`
                  <div class="container-fluid">
                  <div class="row-fluid">
                  <img src="${resort.trailMap_image}" class="modal-img">
                    </div>
                  </div>
                  <div class="container-fluid">
                    <div class="row">
                      <div class="col-xs-12">
                        <div class="section-header text-center">
                          <h2>Terrain</h2>
                        </div>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-md-3 col-sm-6 col-xs-12">
                        <div class="card">
                          <div class="card-body">
                            <img class="card-icon" src="images/green_mono.svg">
                            <h5 class="card-data-2">${resort.runsGreen_total}</h5>
                          </div>
                          <div class="progress">
                            <div class="progress-bar progress-bar-striped progress-bar-animated active" role="progressbar" style="width:${resort.runsGreen_percent}%" aria-valuenow="${resort.runsGreen_percent}" aria-valuemin="0" aria-valuemax="100"></div>
                            <div class="progress-bar-title">${resort.runsGreen_percent}%</div>
                          </div>
                        </div>
                      </div>
                      <div class="col-md-3 col-sm-6 col-xs-12">
                        <div class="card">
                          <div class="card-body">
                            <img class="card-icon" src="images/blue_mono.svg">
                            <h5 class="card-data-2">${resort.runsBlue_total}</h5>
                          </div>
                          <div class="progress">
                            <div class="progress-bar progress-bar-striped progress-bar-animated active" role="progressbar" style="width:${resort.runsBlue_percent}%" aria-valuenow="${resort.runsBlue_percent}" aria-valuemin="0" aria-valuemax="100"></div>
                            <div class="progress-bar-title">${resort.runsBlue_percent}%</div>
                          </div>
                        </div>
                      </div>
                      <div class="col-md-3 col-sm-6 col-xs-12">
                        <div class="card">
                          <div class="card-body">
                            <img class="card-icon" src="images/black_mono.svg">
                            <h5 class="card-data-2">${resort.runsBlack_total}</h5>
                          </div>
                          <div class="progress">
                            <div class="progress-bar progress-bar-striped progress-bar-animated active" role="progressbar" style="width:${resort.runsBlack_percent}%" aria-valuenow="${resort.runsBlack_percent}" aria-valuemin="0" aria-valuemax="100"></div>
                            <div class="progress-bar-title">${resort.runsBlack_percent}%</div>
                          </div>
                        </div>
                      </div>
                      <div class="col-md-3 col-sm-6 col-xs-12">
                        <div class="card">
                          <div class="card-body">
                            <img class="card-icon" src="images/expert_mono.svg">
                            <h5 class="card-data-2">${resort.runsExpert_total}</h5>
                          </div>
                          <div class="progress">
                            <div class="progress-bar progress-bar-striped progress-bar-animated active" role="progressbar" style="width:${resort.runsExpert_percent}%" aria-valuenow="${resort.runsExpert_percent}" aria-valuemin="0" aria-valuemax="100"></div>
                            <div class="progress-bar-title">${resort.runsExpert_percent}%</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-md-4 col-sm-12">
                        <div class="card">
                          <div class="card-header">Summit</div>
                          <div class="card-body">
                            <img class="card-icon" src="images/summit.svg">
                            <h5 class="card-data">${(resort.elevation_summit*3.28084).toFixed()}'</h5>
                          </div>
                        </div>
                      </div>
                      <div class="col-md-4 col-sm-12">
                        <div class="card">
                          <div class="card-header">Vertical Drop</div>
                          <div class="card-body">
                            <img class="card-icon" src="images/drop_dark.svg">
                            <h5 class="card-data">${(resort.vertical_drop*3.28084).toFixed()}'</h5>
                          </div>
                        </div>
                      </div>
                      <div class="col-md-4 col-sm-12">
                        <div class="card">
                          <div class="card-header">Base</div>
                          <div class="card-body">
                            <img class="card-icon" src="images/base.svg">
                            <h5 class="card-data">${(resort.elevation_base*3.28084).toFixed()}'</h5>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="row" id="desc">
                      <div class="col-xs-12">
                        <div class="card-description">
                          <h2 class="section">About ${resort.name}</h2>
                          <hr class="light">
                          <p class="overview" id="poverview">${resort.description||''}</p>
                        </div>
                      </div>
                    </div>
                    <div class="row-fluid">
                      <img src="${resort.image_url}" class="modal-img">
                    </div>
                    <div class="row">
                      <div class="col-xs-12">
                        <div class="section-header text-center">
                          <h2>Lifts</h2>
                        </div>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-md-4 col-sm-6">
                        <div class="card-dark">
                          <div class="card-header-dark">Gondolas</div>
                          <div class="card-body">
                            <img class="card-icon-lifts" src="images/gondola_light.svg">
                            <h5 class="card-data-lift">${resort.lift_breakdown.gondolasAndTrams}</h5>
                          </div>
                        </div>
                      </div>
                      <div class="col-md-4 col-sm-6">
                        <div class="card-dark">
                          <div class="card-header-dark">Surace Lifts</div>
                          <div class="card-body">
                            <img class="card-icon-lifts" src="images/surface_light.svg">
                            <h5 class="card-data-lift">${resort.lift_breakdown.surface}</h5>
                          </div>
                        </div>
                      </div>
                      <div class="col-md-4 col-sm-12">
                        <div class="card-dark">
                          <div class="card-header-dark">8 Person</div>
                          <div class="card-body">
                            <img class="card-icon-lifts" src="images/six_light.svg">
                            <h5 class="card-data-lift">${resort.lift_breakdown.eightPerson}</h5>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-md-3 col-sm-6 col-xs-12">
                        <div class="card-dark">
                          <div class="card-header-dark">6 Person</div>
                          <div class="card-body">
                            <img class="card-icon-lifts" src="images/six_light.svg">
                            <h5 class="card-data-lift">${resort.lift_breakdown.sixHS}</h5>
                          </div>
                        </div>
                      </div>
                      <div class="col-md-3 col-sm-6 col-xs-12">
                        <div class="card-dark">
                          <div class="card-header-dark">Quad</div>
                          <div class="card-body">
                            <img class="card-icon-lifts" src="images/four_light.svg">
                            <h5 class="card-data-lift">${resort.lift_breakdown.fourHS + resort.lift_breakdown.fourChairs}</h5>
                          </div>
                        </div>
                      </div>
                      <div class="col-md-3 col-sm-6 col-xs-12">
                        <div class="card-dark">
                          <div class="card-header-dark">Triple</div>
                          <div class="card-body">
                            <img class="card-icon-lifts" src="images/three_light.svg">
                            <h5 class="card-data-lift">${resort.lift_breakdown.threeChairs}</h5>
                          </div>
                        </div>
                      </div>
                      <div class="col-md-3 col-sm-6 col-xs-12">
                        <div class="card-dark">
                          <div class="card-header-dark">Double</div>
                          <div class="card-body">
                            <img class="card-icon-lifts" src="images/two_light.svg">
                            <h5 class="card-data-lift">${resort.lift_breakdown.doubleChairs}</h5>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-xs-12">
                        <div class="section-header text-center">
                          <h2>Weather</h2>
                        </div>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-xs-12">
                        <div class="card">
                          <div class="col-lg-4 col-md-12">
                            <div class="card-header-weather">Weather</div>
                            <div class="card-body">
                              <h5 class="card-data-weather">${resort.CurrentWeather || "--"}</h5>
                            </div>
                          </div>
                          <div class="col-lg-4 col-md-6">
                            <div class="card-header-weather">Temperature</div>
                            <div class="card-body">
                              <h5 class="card-data-weather">${resort.CurrentTemp || "--"}°</h5>
                            </div>
                          </div>
                          <div class="col-lg-4 col-md-6">
                            <div class="card-header-weather">Snowfall</div>
                            <div class="card-body">
                              <h5 class="card-data-weather">${resort.CurrentSnow || "--"}"</h5>
                            </div>
                          </div>
                        </div>
                        <h3 class="weather-banner">Tomorrow's Forecast</h3>
                        <div class="row">
                          <div class="col-xs-12">
                            <div class="card">
                              <div class="col-lg-4 col-md-12">
                                <div class="card-header-weather">Weather</div>
                                <div class="card-body">
                                  <h5 class="card-data-weather">${resort.tomWeather || "--"}</h5>
                                </div>
                              </div>
                              <div class="col-lg-4 col-md-6">
                                <div class="card-header-weather">Temperature</div>
                                <div class="card-body">
                                  <h5 class="card-data-weather">${resort.tomTemp || "--"}°</h5>
                                </div>
                              </div>
                              <div class="col-lg-4 col-md-6">
                                <div class="card-header-weather">% Snow</div>
                                <div class="card-body">
                                  <h5 class="card-data-weather">${resort.tomSnow || "--"}%</h5>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>`);
                    $("#featureModal").modal("show");
                }
            }));
    });

// Creae markers for small resorts
var smMarkers = [];
smResorts.forEach(
    function(resort) {
        smMarkers.push(
            L.marker([resort.lat, resort.lng], { icon: smResortIcon })
            .on({
                click: function(e) {
                    $("#feature-title").html(`${resort.name}`);
                    $("#feature-info").html(`
                  <div class="container-fluid">
                  <div class="row-fluid">
                      <img src="${resort.trailMap_image}" class="modal-img">
                    </div>
                  </div>
                  <div class="container-fluid">
                    <div class="row">
                      <div class="col-xs-12">
                        <div class="section-header text-center">
                          <h2>Terrain</h2>
                        </div>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-md-3 col-sm-6 col-xs-12">
                        <div class="card">
                          <div class="card-body">
                            <img class="card-icon" src="images/green_mono.svg">
                            <h5 class="card-data-2">${resort.runsGreen_total}</h5>
                          </div>
                          <div class="progress">
                            <div class="progress-bar progress-bar-striped progress-bar-animated active" role="progressbar" style="width:${resort.runsGreen_percent}%" aria-valuenow="${resort.runsGreen_percent}" aria-valuemin="0" aria-valuemax="100"></div>
                            <div class="progress-bar-title">${resort.runsGreen_percent}%</div>
                          </div>
                        </div>
                      </div>
                      <div class="col-md-3 col-sm-6 col-xs-12">
                        <div class="card">
                          <div class="card-body">
                            <img class="card-icon" src="images/blue_mono.svg">
                            <h5 class="card-data-2">${resort.runsBlue_total}</h5>
                          </div>
                          <div class="progress">
                            <div class="progress-bar progress-bar-striped progress-bar-animated active" role="progressbar" style="width:${resort.runsBlue_percent}%" aria-valuenow="${resort.runsBlue_percent}" aria-valuemin="0" aria-valuemax="100"></div>
                            <div class="progress-bar-title">${resort.runsBlue_percent}%</div>
                          </div>
                        </div>
                      </div>
                      <div class="col-md-3 col-sm-6 col-xs-12">
                        <div class="card">
                          <div class="card-body">
                            <img class="card-icon" src="images/black_mono.svg">
                            <h5 class="card-data-2">${resort.runsBlack_total}</h5>
                          </div>
                          <div class="progress">
                            <div class="progress-bar progress-bar-striped progress-bar-animated active" role="progressbar" style="width:${resort.runsBlack_percent}%" aria-valuenow="${resort.runsBlack_percent}" aria-valuemin="0" aria-valuemax="100"></div>
                            <div class="progress-bar-title">${resort.runsBlack_percent}%</div>
                          </div>
                        </div>
                      </div>
                      <div class="col-md-3 col-sm-6 col-xs-12">
                        <div class="card">
                          <div class="card-body">
                            <img class="card-icon" src="images/expert_mono.svg">
                            <h5 class="card-data-2">${resort.runsExpert_total}</h5>
                          </div>
                          <div class="progress">
                            <div class="progress-bar progress-bar-striped progress-bar-animated active" role="progressbar" style="width:${resort.runsExpert_percent}%" aria-valuenow="${resort.runsExpert_percent}" aria-valuemin="0" aria-valuemax="100"></div>
                            <div class="progress-bar-title">${resort.runsExpert_percent}%</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-md-4 col-sm-12">
                        <div class="card">
                          <div class="card-header">Summit</div>
                          <div class="card-body">
                            <img class="card-icon" src="images/summit.svg">
                            <h5 class="card-data">${(resort.elevation_summit*3.28084).toFixed()}'</h5>
                          </div>
                        </div>
                      </div>
                      <div class="col-md-4 col-sm-12">
                        <div class="card">
                          <div class="card-header">Vertical Drop</div>
                          <div class="card-body">
                            <img class="card-icon" src="images/drop_dark.svg">
                            <h5 class="card-data">${(resort.vertical_drop*3.28084).toFixed()}'</h5>
                          </div>
                        </div>
                      </div>
                      <div class="col-md-4 col-sm-12">
                        <div class="card">
                          <div class="card-header">Base</div>
                          <div class="card-body">
                            <img class="card-icon" src="images/base.svg">
                            <h5 class="card-data">${(resort.elevation_base*3.28084).toFixed()}'</h5>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="row" id="desc">
                      <div class="col-xs-12">
                        <div class="card-description">
                          <h2 class="section">About ${resort.name}</h2>
                          <hr class="light">
                          <p class="overview" id="poverview">${resort.description||''}</p>
                        </div>
                      </div>
                    </div>
                    <div class="row-fluid">
                      <img src="${resort.image_url}" class="modal-img">
                    </div>
                    <div class="row">
                      <div class="col-xs-12">
                        <div class="section-header text-center">
                          <h2>Lifts</h2>
                        </div>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-md-4 col-sm-6">
                        <div class="card-dark">
                          <div class="card-header-dark">Gondolas</div>
                          <div class="card-body">
                            <img class="card-icon-lifts" src="images/gondola_light.svg">
                            <h5 class="card-data-lift">${resort.lift_breakdown.gondolasAndTrams}</h5>
                          </div>
                        </div>
                      </div>
                      <div class="col-md-4 col-sm-6">
                        <div class="card-dark">
                          <div class="card-header-dark">Surace Lifts</div>
                          <div class="card-body">
                            <img class="card-icon-lifts" src="images/surface_light.svg">
                            <h5 class="card-data-lift">${resort.lift_breakdown.surface}</h5>
                          </div>
                        </div>
                      </div>
                      <div class="col-md-4 col-sm-12">
                        <div class="card-dark">
                          <div class="card-header-dark">8 Person</div>
                          <div class="card-body">
                            <img class="card-icon-lifts" src="images/six_light.svg">
                            <h5 class="card-data-lift">${resort.lift_breakdown.eightPerson}</h5>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-md-3 col-sm-6 col-xs-12">
                        <div class="card-dark">
                          <div class="card-header-dark">6 Person</div>
                          <div class="card-body">
                            <img class="card-icon-lifts" src="images/six_light.svg">
                            <h5 class="card-data-lift">${resort.lift_breakdown.sixHS}</h5>
                          </div>
                        </div>
                      </div>
                      <div class="col-md-3 col-sm-6 col-xs-12">
                        <div class="card-dark">
                          <div class="card-header-dark">Quad</div>
                          <div class="card-body">
                            <img class="card-icon-lifts" src="images/four_light.svg">
                            <h5 class="card-data-lift">${resort.lift_breakdown.fourHS + resort.lift_breakdown.fourChairs}</h5>
                          </div>
                        </div>
                      </div>
                      <div class="col-md-3 col-sm-6 col-xs-12">
                        <div class="card-dark">
                          <div class="card-header-dark">Triple</div>
                          <div class="card-body">
                            <img class="card-icon-lifts" src="images/three_light.svg">
                            <h5 class="card-data-lift">${resort.lift_breakdown.threeChairs}</h5>
                          </div>
                        </div>
                      </div>
                      <div class="col-md-3 col-sm-6 col-xs-12">
                        <div class="card-dark">
                          <div class="card-header-dark">Double</div>
                          <div class="card-body">
                            <img class="card-icon-lifts" src="images/two_light.svg">
                            <h5 class="card-data-lift">${resort.lift_breakdown.doubleChairs}</h5>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-xs-12">
                        <div class="section-header text-center">
                          <h2>Weather</h2>
                        </div>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-xs-12">
                        <div class="card">
                          <div class="col-lg-4 col-md-12">
                            <div class="card-header-weather">Weather</div>
                            <div class="card-body">
                              <h5 class="card-data-weather">${resort.CurrentWeather || "--"}</h5>
                            </div>
                          </div>
                          <div class="col-lg-4 col-md-6">
                            <div class="card-header-weather">Temperature</div>
                            <div class="card-body">
                              <h5 class="card-data-weather">${resort.CurrentTemp || "--"}°</h5>
                            </div>
                          </div>
                          <div class="col-lg-4 col-md-6">
                            <div class="card-header-weather">Snowfall</div>
                            <div class="card-body">
                              <h5 class="card-data-weather">${resort.CurrentSnow || "--"}"</h5>
                            </div>
                          </div>
                        </div>
                        <h3 class="weather-banner">Tomorrow's Forecast</h3>
                        <div class="row">
                          <div class="col-xs-12">
                            <div class="card">
                              <div class="col-lg-4 col-md-12">
                                <div class="card-header-weather">Weather</div>
                                <div class="card-body">
                                  <h5 class="card-data-weather">${resort.tomWeather || "--"}</h5>
                                </div>
                              </div>
                              <div class="col-lg-4 col-md-6">
                                <div class="card-header-weather">Temperature</div>
                                <div class="card-body">
                                  <h5 class="card-data-weather">${resort.tomTemp || "--"}°</h5>
                                </div>
                              </div>
                              <div class="col-lg-4 col-md-6">
                                <div class="card-header-weather">% Snow</div>
                                <div class="card-body">
                                  <h5 class="card-data-weather">${resort.tomSnow || "--"}%</h5>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>`);
                    $("#featureModal").modal("show");
                }
            }));
    });


// Resorts in Asia
lgResortsAsia = [];
smResortsAsia = [];

asiaResorts.forEach(function(resort) {
    if (resort.total_runs >= 18) {
        lgResortsAsia.push(resort);
    }
});

// Populate array of small resorts
asiaResorts.forEach(function(resort) {
    if (resort.total_runs < 18 || resort.runs_total == null) {
        smResortsAsia.push(resort);
    };
});

// Create markers for large resorts
var lgMarkersAsia = [];
lgResortsAsia.forEach(
    function(resort) {
        lgMarkers.push(
            L.marker([resort.lat, resort.lng], { icon: lgResortIcon })
            .on({
                click: function(e) {
                    $("#feature-title").html(`${resort.name}`);
                    $("#feature-info").html(`
                  <div class="container-fluid">
                  <div class="row-fluid">
                      <img src="${resort.trailMap_image}" class="modal-img">
                    </div>
                  </div>
                  <div class="container-fluid">
                    <div class="row">
                      <div class="col-xs-12">
                        <div class="section-header text-center">
                          <h2>Terrain</h2>
                        </div>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-sm-4 col-xs-12">
                        <div class="card">
                          <div class="card-body">
                            <img class="card-icon" src="images/green_mono.svg">
                            <h5 class="card-data-2">${(resort.runsGreen_total*0.621371).toFixed(1)}</h5>
                            <h6 class="card-miles">Miles <h6>
                          </div>
                          <div class="progress">
                            <div class="progress-bar progress-bar-striped progress-bar-animated active" role="progressbar" style="width:${resort.runsGreen_percent}%" aria-valuenow="${resort.runsGreen_percent}" aria-valuemin="0" aria-valuemax="100"></div>
                            <div class="progress-bar-title">${(resort.runsGreen_percent).toFixed()}%</div>
                          </div>
                        </div>
                      </div>
                      <div class="col-sm-4 col-xs-12">
                        <div class="card">
                          <div class="card-body">
                            <img class="card-icon" src="images/blue_mono.svg">
                            <h5 class="card-data-2">${(resort.runsBlue_total*0.621371).toFixed(1)}</h5>
                            <h6 class="card-miles">Miles <h6>
                          </div>
                          <div class="progress">
                            <div class="progress-bar progress-bar-striped progress-bar-animated active" role="progressbar" style="width:${resort.runsBlue_percent}%" aria-valuenow="${resort.runsBlue_percent}" aria-valuemin="0" aria-valuemax="100"></div>
                            <div class="progress-bar-title">${(resort.runsBlue_percent).toFixed()}%</div>
                          </div>
                        </div>
                      </div>
                      <div class="col-sm-4 col-xs-12">
                        <div class="card">
                          <div class="card-body">
                            <img class="card-icon" src="images/black_mono.svg">
                            <h5 class="card-data-2">${(resort.runsBlack_total*0.621371).toFixed(1)}</h5>
                            <h6 class="card-miles">Miles <h6>
                          </div>
                          <div class="progress">
                            <div class="progress-bar progress-bar-striped progress-bar-animated active" role="progressbar" style="width:${resort.runsBlack_percent}%" aria-valuenow="${resort.runsBlack_percent}" aria-valuemin="0" aria-valuemax="100"></div>
                            <div class="progress-bar-title">${(resort.runsBlack_percent).toFixed()}%</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-md-4 col-sm-12">
                        <div class="card">
                          <div class="card-header">Summit</div>
                          <div class="card-body">
                            <img class="card-icon" src="images/summit.svg">
                            <h5 class="card-data">${(resort.elevation_summit*3.28084).toFixed()}'</h5>
                          </div>
                        </div>
                      </div>
                      <div class="col-md-4 col-sm-12">
                        <div class="card">
                          <div class="card-header">Vertical Drop</div>
                          <div class="card-body">
                            <img class="card-icon" src="images/drop_dark.svg">
                            <h5 class="card-data">${(resort.vertical_drop*3.28084).toFixed()}'</h5>
                          </div>
                        </div>
                      </div>
                      <div class="col-md-4 col-sm-12">
                        <div class="card">
                          <div class="card-header">Base</div>
                          <div class="card-body">
                            <img class="card-icon" src="images/base.svg">
                            <h5 class="card-data">${(resort.elevation_base*3.28084).toFixed()}'</h5>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="row" id="desc">
                      <div class="col-xs-12">
                        <div class="card-description">
                          <h2 class="section">About ${resort.name}</h2>
                          <hr class="light">
                          <p class="overview" id="poverview">${resort.description||''}</p>
                        </div>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-xs-12">
                        <div class="section-header text-center">
                          <h2>Lifts</h2>
                        </div>
                      </div>
                    </div>
                    <div class="row"></div>
                    <div class="row">
                      <div class="col-xl-3 col-lg-6 col-sm-6 col-xs-12">
                        <div class="card-dark">
                          <div class="card-header-dark">Gondolas & Trams</div>
                          <div class="card-body">
                            <img class="card-icon-lifts" src="images/gondola_light.svg">
                            <h5 class="card-data-lift">${resort.lift_breakdown.gondolasAndTrams}</h5>
                          </div>
                        </div>
                      </div>
                      <div class="col-xl-3 col-lg-6 col-sm-6 col-xs-12">
                        <div class="card-dark">
                          <div class="card-header-dark">Trains & Funiculars</div>
                          <div class="card-body">
                            <img class="card-icon-lifts" src="images/funicular_light.svg">
                            <h5 class="card-data-lift">${resort.lift_breakdown.trains}</h5>
                          </div>
                        </div>
                      </div>
                      <div class="col-xl-3 col-lg-6 col-sm-6 col-xs-12">
                        <div class="card-dark">
                          <div class="card-header-dark">Chairlifts</div>
                          <div class="card-body">
                            <img class="card-icon-lifts" src="images/four_light.svg">
                            <h5 class="card-data-lift">${resort.lift_breakdown.chairlifts}</h5>
                          </div>
                        </div>
                      </div>
                      <div class="col-xl-3 col-lg-6 col-sm-6 col-xs-12">
                        <div class="card-dark">
                          <div class="card-header-dark">Surface Lifts</div>
                          <div class="card-body">
                            <img class="card-icon-lifts" src="images/surface_light.svg">
                            <h5 class="card-data-lift">${resort.lift_breakdown.surface}</h5>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-xs-12">
                        <div class="section-header text-center">
                          <h2>Weather</h2>
                        </div>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-xs-12">
                        <div class="card">
                          <div class="col-lg-4 col-md-12">
                            <div class="card-header-weather">Weather</div>
                            <div class="card-body">
                              <h5 class="card-data-weather">${resort.CurrentWeather || "--"}</h5>
                            </div>
                          </div>
                          <div class="col-lg-4 col-md-6">
                            <div class="card-header-weather">Temperature</div>
                            <div class="card-body">
                              <h5 class="card-data-weather">${resort.CurrentTemp || "--"}°</h5>
                            </div>
                          </div>
                          <div class="col-lg-4 col-md-6">
                            <div class="card-header-weather">Snowfall</div>
                            <div class="card-body">
                              <h5 class="card-data-weather">${resort.CurrentSnow || "--"}"</h5>
                            </div>
                          </div>
                        </div>
                        <h3 class="weather-banner">Tomorrow's Forecast</h3>
                        <div class="row">
                          <div class="col-xs-12">
                            <div class="card">
                              <div class="col-lg-4 col-md-12">
                                <div class="card-header-weather">Weather</div>
                                <div class="card-body">
                                  <h5 class="card-data-weather">${resort.tomWeather || "--"}</h5>
                                </div>
                              </div>
                              <div class="col-lg-4 col-md-6">
                                <div class="card-header-weather">Temperature</div>
                                <div class="card-body">
                                  <h5 class="card-data-weather">${resort.tomTemp || "--"}°</h5>
                                </div>
                              </div>
                              <div class="col-lg-4 col-md-6">
                                <div class="card-header-weather">% Snow</div>
                                <div class="card-body">
                                  <h5 class="card-data-weather">${resort.tomSnow || "--"}%</h5>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>`);
                    $("#featureModal").modal("show");
                }
            }));
    });



var smMarkersAsia = [];
smResortsAsia.forEach(
    function(resort) {
        smMarkers.push(
            L.marker([resort.lat, resort.lng], { icon: smResortIcon })
            .on({
                click: function(e) {
                    $("#feature-title").html(`${resort.name}`);
                    $("#feature-info").html(`
                  <div class="container-fluid">
                  <div class="row-fluid">
                      <img src="${resort.trailMap_image}" class="modal-img">
                    </div>
                  </div>
                  <div class="container-fluid">
                    <div class="row">
                      <div class="col-xs-12">
                        <div class="section-header text-center">
                          <h2>Terrain</h2>
                        </div>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-sm-4 col-xs-12">
                        <div class="card">
                          <div class="card-body">
                            <img class="card-icon" src="images/green_mono.svg">
                            <h5 class="card-data-2">${(resort.runsGreen_total*0.621371).toFixed(1)}</h5>
                            <h6 class="card-miles">Miles <h6>
                          </div>
                          <div class="progress">
                            <div class="progress-bar progress-bar-striped progress-bar-animated active" role="progressbar" style="width:${resort.runsGreen_percent}%" aria-valuenow="${resort.runsGreen_percent}" aria-valuemin="0" aria-valuemax="100"></div>
                            <div class="progress-bar-title">${(resort.runsGreen_percent).toFixed()}%</div>
                          </div>
                        </div>
                      </div>
                      <div class="col-sm-4 col-xs-12">
                        <div class="card">
                          <div class="card-body">
                            <img class="card-icon" src="images/blue_mono.svg">
                            <h5 class="card-data-2">${(resort.runsBlue_total*0.621371).toFixed(1)}</h5>
                            <h6 class="card-miles">Miles <h6>
                          </div>
                          <div class="progress">
                            <div class="progress-bar progress-bar-striped progress-bar-animated active" role="progressbar" style="width:${resort.runsBlue_percent}%" aria-valuenow="${resort.runsBlue_percent}" aria-valuemin="0" aria-valuemax="100"></div>
                            <div class="progress-bar-title">${(resort.runsBlue_percent).toFixed()}%</div>
                          </div>
                        </div>
                      </div>
                      <div class="col-sm-4 col-xs-12">
                        <div class="card">
                          <div class="card-body">
                            <img class="card-icon" src="images/black_mono.svg">
                            <h5 class="card-data-2">${(resort.runsBlack_total*0.621371).toFixed(1)}</h5>
                            <h6 class="card-miles">Miles <h6>
                          </div>
                          <div class="progress">
                            <div class="progress-bar progress-bar-striped progress-bar-animated active" role="progressbar" style="width:${resort.runsBlack_percent}%" aria-valuenow="${resort.runsBlack_percent}" aria-valuemin="0" aria-valuemax="100"></div>
                            <div class="progress-bar-title">${(resort.runsBlack_percent).toFixed()}%</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-md-4 col-sm-12">
                        <div class="card">
                          <div class="card-header">Summit</div>
                          <div class="card-body">
                            <img class="card-icon" src="images/summit.svg">
                            <h5 class="card-data">${(resort.elevation_summit*3.28084).toFixed()}'</h5>
                          </div>
                        </div>
                      </div>
                      <div class="col-md-4 col-sm-12">
                        <div class="card">
                          <div class="card-header">Vertical Drop</div>
                          <div class="card-body">
                            <img class="card-icon" src="images/drop_dark.svg">
                            <h5 class="card-data">${(resort.vertical_drop*3.28084).toFixed()}'</h5>
                          </div>
                        </div>
                      </div>
                      <div class="col-md-4 col-sm-12">
                        <div class="card">
                          <div class="card-header">Base</div>
                          <div class="card-body">
                            <img class="card-icon" src="images/base.svg">
                            <h5 class="card-data">${(resort.elevation_base*3.28084).toFixed()}'</h5>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="row" id="desc">
                      <div class="col-xs-12">
                        <div class="card-description">
                          <h2 class="section">About ${resort.name}</h2>
                          <hr class="light">
                          <p class="overview" id="poverview">${resort.description||''}</p>
                        </div>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-xs-12">
                        <div class="section-header text-center">
                          <h2>Lifts</h2>
                        </div>
                      </div>
                    </div>
                    <div class="row"></div>
                    <div class="row">
                      <div class="col-xl-3 col-lg-6 col-sm-6 col-xs-12">
                        <div class="card-dark">
                          <div class="card-header-dark">Gondolas & Trams</div>
                          <div class="card-body">
                            <img class="card-icon-lifts" src="images/gondola_light.svg">
                            <h5 class="card-data-lift">${resort.lift_breakdown.gondolasAndTrams}</h5>
                          </div>
                        </div>
                      </div>
                      <div class="col-xl-3 col-lg-6 col-sm-6 col-xs-12">
                        <div class="card-dark">
                          <div class="card-header-dark">Trains & Funiculars</div>
                          <div class="card-body">
                            <img class="card-icon-lifts" src="images/funicular_light.svg">
                            <h5 class="card-data-lift">${resort.lift_breakdown.trains}</h5>
                          </div>
                        </div>
                      </div>
                      <div class="col-xl-3 col-lg-6 col-sm-6 col-xs-12">
                        <div class="card-dark">
                          <div class="card-header-dark">Chairlifts</div>
                          <div class="card-body">
                            <img class="card-icon-lifts" src="images/four_light.svg">
                            <h5 class="card-data-lift">${resort.lift_breakdown.chairlifts}</h5>
                          </div>
                        </div>
                      </div>
                      <div class="col-xl-3 col-lg-6 col-sm-6 col-xs-12">
                        <div class="card-dark">
                          <div class="card-header-dark">Surface Lifts</div>
                          <div class="card-body">
                            <img class="card-icon-lifts" src="images/surface_light.svg">
                            <h5 class="card-data-lift">${resort.lift_breakdown.surface}</h5>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-xs-12">
                        <div class="section-header text-center">
                          <h2>Weather</h2>
                        </div>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-xs-12">
                        <div class="card">
                          <div class="col-lg-4 col-md-12">
                            <div class="card-header-weather">Weather</div>
                            <div class="card-body">
                              <h5 class="card-data-weather">${resort.CurrentWeather || "--"}</h5>
                            </div>
                          </div>
                          <div class="col-lg-4 col-md-6">
                            <div class="card-header-weather">Temperature</div>
                            <div class="card-body">
                              <h5 class="card-data-weather">${resort.CurrentTemp || "--"}°</h5>
                            </div>
                          </div>
                          <div class="col-lg-4 col-md-6">
                            <div class="card-header-weather">Snowfall</div>
                            <div class="card-body">
                              <h5 class="card-data-weather">${resort.CurrentSnow || "--"}"</h5>
                            </div>
                          </div>
                        </div>
                        <h3 class="weather-banner">Tomorrow's Forecast</h3>
                        <div class="row">
                          <div class="col-xs-12">
                            <div class="card">
                              <div class="col-lg-4 col-md-12">
                                <div class="card-header-weather">Weather</div>
                                <div class="card-body">
                                  <h5 class="card-data-weather">${resort.tomWeather || "--"}</h5>
                                </div>
                              </div>
                              <div class="col-lg-4 col-md-6">
                                <div class="card-header-weather">Temperature</div>
                                <div class="card-body">
                                  <h5 class="card-data-weather">${resort.tomTemp || "--"}°</h5>
                                </div>
                              </div>
                              <div class="col-lg-4 col-md-6">
                                <div class="card-header-weather">% Snow</div>
                                <div class="card-body">
                                  <h5 class="card-data-weather">${resort.tomSnow || "--"}%</h5>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>`);
                    $("#featureModal").modal("show");
                }
            }));
    });


// Initialize all of the LayerGroups we'll be using
var layers = {
    smResortLayer: new L.LayerGroup(smMarkers),
    lgResortLayer: new L.LayerGroup(lgMarkers),
};

// Create the map with our layers
var map = L.map("map", {
    center: [20, 0],
    zoom: 2.5,
    zoomControl: false,
    maxZoom: 13,
    minZoom: 2,
    layers: [
        layers.smResortLayer,
        layers.lgResortLayer,
    ]
});

// Add our 'lightmap' tile layer to the map
customMap.addTo(map);
snowLayer.addTo(map);

// Create an overlays object to add to the layer control
var overlays = {
    "Large Resorts": layers.lgResortLayer,
    "Small Resorts": layers.smResortLayer,
};

function localData(text, callResponse) {
    //here can use custom criteria or merge data from multiple layers
    callResponse(allResorts);


    return { //called to stop previous requests on map move
        abort: function() {
            console.log('aborted request:' + text);
        }
    };
}

map.addControl(new L.Control.Search({
    sourceData: localData,
    text: '...',
    hideMarkerOnCollapse: true,
    propertyName: 'name',
    propertyLoc: ['lat', 'lng'],
    zoom: 12,
    position: 'topleft',
    collapsed: false,
    autoCollapse: true,
    markerLocation: true
}));

L.control.zoom({
    position: 'topleft',
    margin: 20
}).addTo(map);

L.control.layers(null, overlays, { collapsed: false }).addTo(map);