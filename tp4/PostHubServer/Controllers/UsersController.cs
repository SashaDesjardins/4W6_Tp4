using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using PostHubServer.Models;
using PostHubServer.Models.DTOs;
using PostHubServer.Services;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Processing;

namespace PostHubServer.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        readonly UserManager<User> _userManager;

        public UsersController(UserManager<User> userManager)
        {
            _userManager = userManager;
        }

        [HttpPost]
        public async Task<ActionResult> Register(RegisterDTO register)
        {
            if (register.Password != register.PasswordConfirm)
            {
                return StatusCode(StatusCodes.Status400BadRequest,
                    new { Message = "Les deux mots de passe spécifiés sont différents." });
            }
            User user = new User()
            {
                UserName = register.Username,
                Email = register.Email
            };
            IdentityResult identityResult = await _userManager.CreateAsync(user, register.Password);
            if (!identityResult.Succeeded)
            {
                return StatusCode(StatusCodes.Status500InternalServerError,
                    new { Message = "La création de l'utilisateur a échoué." });
            }
            return Ok(new { Message = "Inscription réussie ! 🥳" });
        }

        [HttpPost]
        public async Task<ActionResult> Login(LoginDTO login)
        {
            User? user = await _userManager.FindByNameAsync(login.Username);
            if (user == null) {
                user = await _userManager.FindByEmailAsync(login.Username);
            }
            if (user != null && await _userManager.CheckPasswordAsync(user, login.Password))
            {
                IList<string> roles = await _userManager.GetRolesAsync(user);
                List<Claim> authClaims = new List<Claim>();
                foreach (string role in roles)
                {
                    authClaims.Add(new Claim(ClaimTypes.Role, role));
                }
                authClaims.Add(new Claim(ClaimTypes.NameIdentifier, user.Id));
                SymmetricSecurityKey key = new SymmetricSecurityKey(Encoding.UTF8
                    .GetBytes("LooOOongue Phrase SiNoN Ça ne Marchera PaAaAAAaAas !"));
                JwtSecurityToken token = new JwtSecurityToken(
                    issuer: "https://localhost:7216",
                    audience: "http://localhost:4200",
                    claims: authClaims,
                    expires: DateTime.Now.AddMinutes(300),
                    signingCredentials: new SigningCredentials(key, SecurityAlgorithms.HmacSha256Signature)
                    );
                return Ok(new
                {
                    token = new JwtSecurityTokenHandler().WriteToken(token),
                    validTo = token.ValidTo,
                    username = user.UserName,
                    roles = roles// Ceci sert déjà à afficher / cacher certains boutons côté Angular
                });
            }
            else
            {
                return StatusCode(StatusCodes.Status400BadRequest,
                    new { Message = "Le nom d'utilisateur ou le mot de passe est invalide." });
            }
        }

        [HttpPut]
        public async Task<ActionResult> EditUser()
        {
            string? oldPassword = Request.Form["old"];
            string? newPassword = Request.Form["new"];
            User? user = await _userManager.FindByIdAsync(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            if (user == null) return Unauthorized();
            try
            {
                IFormCollection formCollection = await Request.ReadFormAsync();
                IFormFile? file = formCollection.Files.GetFile("image");
                Image image = Image.Load(file.OpenReadStream());
                if (oldPassword != null && newPassword != null) {
                    await _userManager.ChangePasswordAsync(user, oldPassword, newPassword);
                }
                
                user.FileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
                user.MimeType = file.ContentType;
                image.Save(Directory.GetCurrentDirectory() + "/images/avatar/" + user.FileName);
                await _userManager.UpdateAsync(user);
            }
            catch (Exception)
            {
                throw;
            }
            return Ok();
        }

        [HttpGet("{pseudo}")]
        public async Task<ActionResult<Picture>> GetPictureAvatar(string pseudo)
        {
            User? user = await _userManager.FindByNameAsync(pseudo);
            if (user == null) return Unauthorized();

            byte[] bytes = System.IO.File.ReadAllBytes(Directory.GetCurrentDirectory() + "/images/avatar/" + user.FileName);
            return File(bytes, user.MimeType);
        }

        [HttpPut]
        [Authorize(Roles ="admin")]
        public async Task<ActionResult> ChangeRole(string username)
        {
            User? user= await _userManager.FindByNameAsync(username);
            if(user == null) return Unauthorized();
            await _userManager.AddToRoleAsync(user, "moderator");
            return Ok("L'utilisateur est maitenant un modérateur");
        }

    }
}
