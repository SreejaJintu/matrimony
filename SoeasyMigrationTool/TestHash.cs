using System;
using BCrypt.Net;

namespace SoeasyMigrationTool {
    class TestHash {
        static void Main() {
            var h = BCrypt.Net.BCrypt.HashPassword("Test@12345");
            Console.WriteLine("MY_HASH: " + h);
            Console.WriteLine("MATCH OLD: " + BCrypt.Net.BCrypt.Verify("Test@12345", "$2a$11$hdDPlYGRMXVNI9Fer7tygubYANTer/IhfTM8jaxCPCIWynRufv8gy"));
        }
    }
}
