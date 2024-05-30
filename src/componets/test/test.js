
describe('API Tests', () => {
    it('should fetch data from the API', async () => {
      const response = await fetch('https://api.openweathermap.org/data/2.5/weather?q=Jalapa,%20GT&appid=664f855485a79428ecf25f52fc7f6709');
      expect(response.ok).toBe(true);
    });
  });   


  describe('formatMinutes', () => {
    it('should format minutes correctly', () => {
      expect(formatMinutes(5)).toBe('05');
      expect(formatMinutes(15)).toBe('15');
    });
  });


  describe('convertTemperature', () => {
    it('should convert Celsius to Fahrenheit correctly', () => {
      expect(convertTemperature(5, 'fahrenheit')).toBe(41);
      expect(convertTemperature(35, 'fahrenheit')).toBe(95);
    });
  
    it('should return the same temperature in Celsius', () => {
      expect(convertTemperature(0, 'celsius')).toBe(0);
      expect(convertTemperature(20, 'celsius')).toBe(20);
    });
  });
  

  window.onerror = function(msg, url, line, col, error) {
    console.log(`Error: ${msg} en ${url}:${line}:${col}`);
    return true;
  }

  describe('API Tests', () => {
    it('should fetch data from the API with multiple requests', async () => {
      const requests = [
        fetch('https://api.openweathermap.org/data/2.5/weather?q=Jalapa,%20GT&appid=664f855485a79428ecf25f52fc7f6709'),
        fetch('https://api.openweathermap.org/data/2.5/weather?q=London&appid=664f855485a79428ecf25f52fc7f6709'),
        fetch('https://api.openweathermap.org/data/2.5/weather?q=Tokyo&appid=664f855485a79428ecf25f52fc7f6709'),
        fetch('https://api.openweathermap.org/data/2.5/weather?q=New%20York&appid=664f855485a79428ecf25f52fc7f6709'),
        fetch('https://api.openweathermap.org/data/2.5/weather?q=Sydney&appid=664f855485a79428ecf25f52fc7f6709'),
      ];
  
      const responses = await Promise.all(requests);
  
      responses.forEach((response) => {
        expect(response.ok).toBe(true);
      });
  
      const data = await Promise.all(responses.map((response) => response.json()));
    }, 10000); // Aumenta el tiempo de espera si es necesario
  });

  