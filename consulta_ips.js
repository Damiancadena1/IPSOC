
document.addEventListener('DOMContentLoaded', function () {
  const ipForm = document.getElementById('ip-form');
  const ipInput = document.getElementById('ip-input');
  const resultsDiv = document.getElementById('results');

  ipForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const ips = ipInput.value.split(/[\s,]+/).map(ip => ip.trim());
    resultsDiv.innerHTML = '';
    ips.forEach(ip => {
      fetchAbuseIPDB(ip);
    });
  });

  function fetchAbuseIPDB(ip) {
    fetch(`check_ip.php?ip=${ip}`)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error(`Error al consultar el API de AbuseIPDB: ${response.status}`);
        }
      })
      .then(data => {
        const score = data.data.abuseConfidenceScore;
        let color;

        if (score >= 75) {
          color = 'red';
        } else if (score >= 40) {
          color = 'orange';
        } else {
          color = 'yellow';
        }

        const resultTable = `
          <table>
            <tr>
              <th> - IP</th>
              <td>${ip}</td>
            </tr>
            <tr>
              <th> - This IP was reported</th>
              <td>${data.data.totalReports} times. Confidence of Abuse is ${score}%</td>
            </tr>
            <tr>
              <th> - Reputation</th>
              <td>
                <div class="progress-bar">
                  <span style="width: ${score}%; background-color: ${color};">${score}%</span>
                </div>
              </td>
            </tr>
            <tr>
              <th> - ISP</th>
              <td>${data.data.isp}</td>
            </tr>
            <tr>
              <th> - Usage Type</th>
              <td>${data.data.usageType}</td>
            </tr>
            <tr>
              <th> - Hostname(s)</th>
              <td>${data.data.hostnames.join(', ')}</td>
            </tr>
            <tr>
              <th> - Domain Name</th>
              <td>${data.data.domain}</td>
            </tr>
            <tr>
              <th> - CountryCode</th>
              <td>${data.data.countryCode}</td>
            </tr>
            
            
            
             
            
          </table>
        `;

        const infoText = `
          <p>
            La direccion IP ${ip} es operada por el ISP ${data.data.isp}, ha sido reportada un total de ${data.data.totalReports} veces por actividades sospechosas o maliciosas, con un porcentaje de mala reputacion del ${score}%.
          </p>
          
        `;

        resultsDiv.innerHTML += `
          <div style="margin-bottom: 2rem;">
            ${resultTable}
            <br>
            ${infoText}
          </div>
        `;
      })
      .catch(error => {
        console.error('Error al consultar el API de AbuseIPDB:', error);
      });
  }
});