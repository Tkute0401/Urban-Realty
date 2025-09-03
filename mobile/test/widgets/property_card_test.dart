import "package:flutter_test/flutter_test.dart";
import "package:flutter/material.dart";
import "package:urban_realty_mobile/widgets/property_card.dart";
import "package:urban_realty_mobile/models/property.dart";

void main() {
  group("PropertyCard Widget Tests", () {
    Property createTestProperty() {
      return Property(
        id: "123",
        title: "Test Property",
        description: "Test Description",
        type: "House",
        status: "For Sale",
        price: 500000,
        bedrooms: 3,
        bathrooms: 2,
        area: 2000,
        address: PropertyAddress(
          line1: "123 Test St",
          street: "Test Street",
          city: "Test City",
          locality: "Test Locality",
          state: "TS",
          zipCode: "12345",
          country: "India",
          formattedAddress: "123 Test St, Test City, TS 12345, India",
        ),
        location: PropertyLocation(
          type: "Point",
          coordinates: [0.0, 0.0],
          formattedAddress: "123 Test St, Test City, TS 12345, India",
          street: "Test Street",
          city: "Test City",
          state: "TS",
          zipCode: "12345",
          country: "India",
        ),
        nearbyLocalities: NearbyLocalities(
          hasSchool: false,
          school: "",
          hasHospital: false,
          hospital: "",
          hasMall: false,
          mall: "",
          hasPark: false,
          park: "",
          hasTransport: false,
          transport: "",
        ),
        projectDetails: ProjectDetails(
          projectArea: "100 acres",
          totalUnits: "500",
          reraId: "TS123456",
          configurations: "1BHK, 2BHK, 3BHK",
        ),
        buildingName: "Test Building",
        floorNumber: "1",
        amenities: [],
        highlights: [],
        images: [],
        featured: false,
        agent: PropertyAgent(
          id: "agent1",
          name: "Test Agent",
          email: "agent@test.com",
          mobile: "1234567890",
        ),
        views: 0,
        createdAt: DateTime.now(),
        slug: "test-property",
        approvals: [],
        constructionStatus: "Ready to Move",
        floorPlanImages: [],
      );
    }

    testWidgets("should display property information", (WidgetTester tester) async {
      final property = createTestProperty();

      await tester.pumpWidget(MaterialApp(
        home: Scaffold(
          body: PropertyCard(property: property),
        ),
      ));

      expect(find.text("Test Property"), findsOneWidget);
      expect(find.text("\$500,000"), findsOneWidget);
      expect(find.text("3"), findsOneWidget);
      expect(find.text("2"), findsOneWidget);
      expect(find.text("2,000 sq ft"), findsOneWidget);
    });

    testWidgets("should call onTap when tapped", (WidgetTester tester) async {
      bool tapped = false;
      final property = createTestProperty();

      await tester.pumpWidget(MaterialApp(
        home: Scaffold(
          body: PropertyCard(
            property: property,
            onTap: () {
              tapped = true;
            },
          ),
        ),
      ));

      await tester.tap(find.byType(InkWell));
      expect(tapped, true);
    });
  });
}