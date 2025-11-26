using System.Security.Claims;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using PostHubServer.Data;
using PostHubServer.Models;
namespace PostHubServer.Services
{
    public class PictureService
    {
        private readonly PostHubContext _context;

        public PictureService(PostHubContext context)
        {
            _context = context;
        }

        public async Task<Picture> AddPicture(Picture picture)
        {
            IsContextNull();
            _context.Pictures.Add(picture);
            await _context.SaveChangesAsync();
            return picture;
        }

        public async  Task<Picture?> GetPicture(int id)
        {
            IsContextNull();

            Picture? picture = await _context.Pictures.FindAsync(id);
            if (picture==null)
            {
                return null;    
            }
            return picture;
        }
        private bool IsContextNull() => _context == null || _context.Pictures == null;
    }
}
