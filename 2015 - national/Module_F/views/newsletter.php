<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>newsletter</title>
    <style>
        body{font: 13px/1.5em Tahoma;}
        img.pic{width: 150px;height: 200px;border:1px solid #ddd;float:right;margin-left: 10px;}
        p{margin: 0;}


        @media print
        {
            body>div{margin:30px}
            .footer{page-break-after:always;}
            body>div:last-of-type .footer{page-break-after: avoid}
        }
    </style>
</head>
<body>
    <?php foreach ($info as $item) { ?>
        <div style="page-break-before: always;">
            <img src="data:image/jpeg;base64,<?= $item['pic'] ?>" alt="" class="pic">
            <p>
                Dear "<?= $item['full_name'] ?>".

                <br />

                The "Skill" "Medal" Medallist of Worldskills "Year".
                <br />

                The "Skill"'s Competitor of Worldskills "Year".

                <br />
                <br />


                This to inform all the project heads and team leaders that management has decided to conduct a meeting on 15.08.2014. The agenda of the meeting is to discuss the comprehensive solutions provided by the experts and management to grow the company in this competitive market. Therefore, we request you all to attend the meeting without any fail.
                We also like to request you all to present their plans and ideas on the company and team’s growth. The administration is also requesting all the project managers to provide a report on the production and services offered by the team on the last month.
                The management is also attaching all the information and details related to the meeting along with this memo. For any doubts or queries, contact us within two working days.

                <br />
                <br />
                <br />
            <div class="footer">
                Best Regards
                <br />
                Koroush Parand
        </div>
    <?php } ?>
</body>
</html>