const clientId = 'H7I6AKkYu-1jemA5cEVu4w';
const secret = 'z7ABcCN7jUCoOXl9MPEv3lKTuMUFg1r12gG2eQUMiJrGKRYHC4lbrl2vx6bVYw2U';
let accessToken = false;

let Yelp = {
  getAccessToken() {
    if(accessToken) {
      return new Promise(resolve => resolve(accessToken));
    };
    let url = `https://cors-anywhere.herokuapp.com/https://api.yelp.com/oauth2/token?grant_type=client_credentials&client_id=${clientId}&client_secret=${secret}`;
    return fetch(url, {method: 'POST'}).then(response => {
      return response.json();
    }).then(jsonResponse => {
      accessToken = jsonResponse.access_token;
    });
  },
  search(term, location, sortBy) {
    let url = `https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?term=${term}&location=${location}&sort_by=${sortBy}`;
    return Yelp.getAccessToken().then(() => {
      return fetch(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }).then(response => {
        return response.json();
      }).then(jsonResponse => {
        if(jsonResponse.businesses) {
          return jsonResponse.businesses.map(business => {
            return {
              id: business.id,
              imgSrc: business.image_url,
              name: business.name,
              address: business.location.address,
              city: business.location.city,
              state: business.location.state_code,
              zipCode: business.location.postal_code,
              category: business.categories,
              rating: business.rating,
              reviewCount: business.review_count
            }
          })
        }
      });
    });
  },
};

export default Yelp
