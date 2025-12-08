
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using PostHubServer.Models;

namespace PostHubServer.Data
{
    public class PostHubContext : IdentityDbContext<User>
    {
        public PostHubContext (DbContextOptions<PostHubContext> options) : base(options){}

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<IdentityRole>().HasData(
                new IdentityRole { Id = "1", Name = "admin", NormalizedName = "ADMIN" },
                new IdentityRole { Id = "2", Name = "moderator", NormalizedName = "MODERATOR" }
                );
            PasswordHasher<User> hasher=new PasswordHasher<User>();
            User user = new User { 
                Id= "11111111-1111-1111-1111-111111111111",
                UserName="coolAdmin69",
                Email="cool@Admin69.com",
                NormalizedUserName="COOLADMIN69",
                NormalizedEmail="COOL@ADMIN69.COM"
            };
            user.PasswordHash = hasher.HashPassword(user, "Salut1!");

            User user2 = new User
            {
                Id = "11111111-1111-1111-1111-111111111112",
                UserName = "Mod69",
                Email = "mod@mail.com",
                NormalizedUserName = "MOD69",
                NormalizedEmail = "MOD@MAIL.COM"
            };
            user2.PasswordHash = hasher.HashPassword(user2, "Salut1!");

            builder.Entity<User>().HasData(user, user2);
            builder.Entity<IdentityUserRole<string>>().HasData(
                new IdentityUserRole<string> { UserId=user.Id,RoleId="1"},
                new IdentityUserRole<string> { UserId = user2.Id, RoleId = "2" });
        }

        public DbSet<Hub> Hubs { get; set; } = default!;
        public DbSet<Comment> Comments { get; set; } = default!;
        public DbSet<Picture> Pictures { get; set; } = default!;
        public DbSet<Post> Posts { get; set; } = default!;
    }
}
