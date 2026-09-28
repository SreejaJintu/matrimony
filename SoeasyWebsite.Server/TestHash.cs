using System;
using BCrypt.Net;

class TestBcrypt {
    static void Main() {
        var hash = BCrypt.Net.BCrypt.HashPassword("Test@12345");
        Console.WriteLine("NEW_HASH: " + hash);
        bool match1 = BCrypt.Net.BCrypt.Verify("Test@12345", "$2a$11$hdDPlYGRMXVNI9Fer7tygubYANTer/IhfTM8jaxCPCIWynRufv8gy");
        Console.WriteLine("MATCH OLD: " + match1);
    }
}
