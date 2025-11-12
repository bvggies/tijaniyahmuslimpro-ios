// Location service for web using browser Geolocation API

export interface LocationData {
  latitude: number;
  longitude: number;
  city?: string;
  country?: string;
  timezone?: string;
}

class LocationService {
  private static instance: LocationService;
  private cachedLocation: LocationData | null = null;
  private cacheExpiry: number = 0;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  private constructor() {}

  static getInstance(): LocationService {
    if (!LocationService.instance) {
      LocationService.instance = new LocationService();
    }
    return LocationService.instance;
  }

  async getUserLocation(): Promise<LocationData | null> {
    // Check cache first
    if (this.cachedLocation && Date.now() < this.cacheExpiry) {
      return this.cachedLocation;
    }

    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by your browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const location: LocationData = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };

          // Try to get city/country from reverse geocoding
          try {
            const geoData = await this.reverseGeocode(location.latitude, location.longitude);
            location.city = geoData.city;
            location.country = geoData.country;
            location.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
          } catch (error) {
            console.warn('Reverse geocoding failed:', error);
          }

          // Cache the location
          this.cachedLocation = location;
          this.cacheExpiry = Date.now() + this.CACHE_DURATION;

          resolve(location);
        },
        (error) => {
          console.error('Geolocation error:', error);
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000,
        }
      );
    });
  }

  private async reverseGeocode(lat: number, lng: number): Promise<{ city: string; country: string }> {
    try {
      // Using OpenStreetMap Nominatim API (free, no API key required)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'TijaniyahMuslimPro/1.0',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Reverse geocoding failed');
      }

      const data = await response.json();
      const address = data.address || {};

      return {
        city: address.city || address.town || address.village || address.county || 'Unknown',
        country: address.country || 'Unknown',
      };
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      return { city: 'Unknown', country: 'Unknown' };
    }
  }

  clearCache(): void {
    this.cachedLocation = null;
    this.cacheExpiry = 0;
  }
}

export default LocationService;

