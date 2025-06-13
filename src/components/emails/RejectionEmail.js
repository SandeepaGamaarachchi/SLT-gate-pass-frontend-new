export function getRejectionEmailHTMLOut({ senderName, itemDetails, comment }) {
  const itemsList = itemDetails
    .map(
      (item) =>
        `<li style="color: #333; font-size: 15px; margin-bottom: 6px;">
          <span style="font-weight: 500;">Item:</span> ${item.itemName} &nbsp;|&nbsp;
          <span style="font-weight: 500;">Serial No:</span> ${item.serialNo} &nbsp;|&nbsp;
          <span style="font-weight: 500;">Quantity:</span> <strong>${item.quantity}</strong>
        </li>`
    )
    .join("");

  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; font-size: 15px;">
      <p style="color: #333; font-size: 15px;">Dear ${senderName},</p>

      <p style="color: #333; font-size: 15px;">
        We regret to inform you that your request for the following item(s) has been 
        <strong style='color: #e57373; font-size: 15px;'>rejected</strong> during the dispatch approval process 
        at the out location.
      </p>

      <ul style="padding-left: 20px; color: #333; font-size: 15px;">
        ${itemsList}
      </ul>

      <p style="color: #333; font-size: 15px;"><strong>Reason:</strong> ${comment}</p>

      
      <p style="color: #333; font-size: 15px; margin-top: 20px;">
        If you require further assistance, kindly reach out to the designated officer for more details.
      </p>

      <p style="color: #333; font-size: 15px; margin-top: 10px; font-weight: bold;">
          Best regards,<br><span style="display:none;">.</span> Dispatch Team
      </p>

      <hr style="border: 1px solid #e57373; margin-top: 30px;"/>

      <p style="color: #777; font-size: 13px; text-align: center; margin-top: 20px;">
        This is an auto-generated email. Please do not reply to this message.
      </p>
      
    </div>
  `;
}

export default getRejectionEmailHTMLOut;
