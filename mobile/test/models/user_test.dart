import "package:flutter_test/flutter_test.dart";
import "package:urban_realty_mobile/models/user.dart";

void main() {
  group("User Model Tests", () {
    test("should create user from json", () {
      final json = {
        "_id": "123",
        "name": "John Doe",
        "email": "john@example.com",
        "role": "buyer",
      };
      final user = User.fromJson(json);
      expect(user.id, "123");
      expect(user.name, "John Doe");
      expect(user.email, "john@example.com");
      expect(user.role, "buyer");
    });

    test("should convert user to json", () {
      final user = User(
        id: "123",
        name: "John Doe",
        email: "john@example.com",
        role: "buyer",
      );
      final json = user.toJson();
      expect(json["id"], "123");
      expect(json["name"], "John Doe");
      expect(json["email"], "john@example.com");
      expect(json["role"], "buyer");
    });
  });
}
