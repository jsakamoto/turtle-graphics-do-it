using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Web;

namespace TurtleGraphicsDoIt.Models
{
    [DebuggerDisplay("{PartitionKey}, {RowKey}")]
    public class CodeId
    {
        public string PartitionKey { get; set; }

        public string RowKey { get; set; }

        public static CodeId FromCode(string code)
        {
            code = code.Replace("\r\n", "\n").Trim();
            var md5bin = new MD5Cng().ComputeHash(Encoding.UTF8.GetBytes(code));
            var id = new CodeId
            {
                PartitionKey = string.Format("{0:X2}", md5bin.First()).Substring(0, 1),
                RowKey = Convert.ToBase64String(md5bin).Replace('+', '-').Replace('/', '_').TrimEnd('=')
            };
            return id;
        }

        public static CodeId FromRowKey(string rowKey)
        {
            var base64str = rowKey.Replace('-', '+').Replace('_', '/');
            var paddingLen = 4 - base64str.Length % 4;
            if (paddingLen < 4) base64str += new string('=', paddingLen);
            var md5bin = Convert.FromBase64String(base64str);
            var id = new CodeId
            {
                PartitionKey = string.Format("{0:X2}", md5bin.First()).Substring(0, 1),
                RowKey = rowKey
            };
            return id;
        }
    }
}