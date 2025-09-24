# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - banner [ref=e2]:
    - generic [ref=e3]:
      - link "Logo" [ref=e5] [cursor=pointer]:
        - /url: /
        - img "Logo" [ref=e6] [cursor=pointer]
      - navigation [ref=e7]:
        - link "Browse" [ref=e8] [cursor=pointer]:
          - /url: /properties
          - img [ref=e9] [cursor=pointer]
          - generic [ref=e16] [cursor=pointer]: Browse
        - link "Plans" [ref=e17] [cursor=pointer]:
          - /url: /subscriptions
          - img [ref=e18] [cursor=pointer]
          - generic [ref=e23] [cursor=pointer]: Plans
        - link "Login" [ref=e24] [cursor=pointer]:
          - /url: /login
          - img [ref=e25] [cursor=pointer]
          - generic [ref=e29] [cursor=pointer]: Login
        - link "Register" [ref=e30] [cursor=pointer]:
          - /url: /register
          - img [ref=e31] [cursor=pointer]
          - generic [ref=e36] [cursor=pointer]: Register
  - main [ref=e37]:
    - progressbar [ref=e40]:
      - img [ref=e41]
  - contentinfo [ref=e43]:
    - generic [ref=e44]:
      - paragraph [ref=e45]: © 2025 Urban Realty. All rights reserved.
      - paragraph [ref=e46]: Simple Footer - Header and Footer are now working!
  - alert [ref=e47]
```