module APIS
  module V1
    class PersonApi < Grape::API
      include APIS::V1::Defaults

      # GET /api/v1/people
      resource :people do
        # GET /api/v1/people
        desc "Get all people"
        get "/" do
          [
            {
              firstName: 'John',
              lastName: 'Smith',
              age: 25,
              address: {
                streetAddress: '21 2nd Street',
                city: 'New York',
                state: 'NY',
                postalCode: '10021'
              },
              phoneNumber: [
                {
                  type: 'home',
                  number: '212 555-1234'
                },
                {
                  type: 'fax',
                  number: '646 555-4567'
                }
              ]
            }
          ]
        end
      end
    end
  end
end

