# Reference-inspired inventory update

This project remains Northstar Motors, with its existing black-and-red storefront, cart, car profiles, and backend. The references informed feature selection and layout; their source code and assets were not copied.

| Reference idea | Northstar implementation |
| --- | --- |
| Dealership inventory workspace: stock counts, low-stock views, search, price filters, sorting, grid/list controls | Admin inventory command center, backed by the existing FastAPI records |
| Dealership customer browsing: combined filters and ordering | Collapsible advanced budget, sort, and live-stock controls in the existing storefront |
| Dealership inventory: clear empty/loading/retry feedback | Empty-filter state and explicit refresh action |
| Civitas: structured operational overview, metrics, bordered navigation and panels | Black/red admin workspace with metric cards, stock navigation and filter panel |
| Civitas: side-by-side interactive comparison | Buyer-facing, source-linked comparison of two real-world car profiles |

The six Northstar showroom cars remain fictional design concepts. They are excluded from live-stock metrics. Comparison covers only the six real-world editorial profiles and does not imply inventory availability or a price quote. The backend remains the authority for administrator access and stock changes.

Reference repositories: [far-kid/car-dealership-inventory](https://github.com/far-kid/car-dealership-inventory) and [Dhruvg334/Civitas](https://github.com/Dhruvg334/Civitas).
