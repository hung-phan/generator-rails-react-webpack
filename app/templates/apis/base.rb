module APIS
  class Base < Grape::API
    mount APIS::V1::Base
  end
end
