//------------------------------------------------------------------------------
// <auto-generated>
//     此代码已从模板生成。
//
//     手动更改此文件可能导致应用程序出现意外的行为。
//     如果重新生成代码，将覆盖对此文件的手动更改。
// </auto-generated>
//------------------------------------------------------------------------------

namespace Himall.Model
{
    using System;
    using System.Collections.Generic;
    
    public partial class OrderCommentInfo:BaseModel
    {
        long _id;
        public new long Id { get{ return _id; } set{ _id=value; base.Id = value; } }
        public long OrderId { get; set; }
        public long ShopId { get; set; }
        public string ShopName { get; set; }
        public long UserId { get; set; }
        public string UserName { get; set; }
        public System.DateTime CommentDate { get; set; }
        public int PackMark { get; set; }
        public int DeliveryMark { get; set; }
        public int ServiceMark { get; set; }
    
        public virtual OrderInfo OrderInfo { get; set; }
    }
}
